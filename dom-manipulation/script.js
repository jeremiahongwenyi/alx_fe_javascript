document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('newQuoteText');
    const quoteCategory = document.getElementById('newQuoteCategory');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuote');
    const importFile = document.getElementById('importFile');
    const exportJson = document.getElementById('exportJson')
    const categoryFilter = document.getElementById('categoryFilter')
    const filteredQuotes = document.getElementById('filteredQuotes')




    // let quotes = JSON.parse(localStorage.getItem('quotes')) || []
    // console.log(quotes);

    // populateCategories()
    getQuotes()

    const filterFromLocal = JSON.parse(localStorage.getItem('filterValue'))

    if (!filterFromLocal) {
        noFilterApplied()
    } else {
        filterQuotesReal(filterFromLocal)
    }




    // const quotes = [
    //     { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    //     { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
    //     { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" }
    // ];

    function showRandomQuote() {
        if (!quotes.length > 0) {
            quoteDisplay.innerText = "There are no quotes yet,  add one below."
            return;
        }

        let index = Math.floor(Math.random() * quotes.length)
        console.log(index);
        quoteDisplay.innerText = quotes[index].text

        sessionStorage.setItem('lastViewedItem', JSON.stringify(quotes[index].text))

    }


    function createAddQuoteForm() {
        if (quoteText.value === '' || quoteCategory.value === '') {
            console.log('no value typed');
            return;
        }
        const data = { text: quoteText.value, category: quoteCategory.value }
        quotes.push(data);
        saveQuotes();

        // NEW CODE: Sync with server
        postQuoteToServer(data);   // already fine
        syncQuotes();              // NEW CODE: re-sync after posting


        const paragraph = document.createElement('p');
        paragraph.innerText = quoteText.value;
        quoteDisplay.appendChild(paragraph);
    }


    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            const importedQuotes = JSON.parse(event.target.result);
            console.log('this are my imported quotes', (importedQuotes));

            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes))
        getQuotes()
    }

    function getQuotes() {
        quotes = JSON.parse(localStorage.getItem('quotes')) || []
        populateCategories()
    }

    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function populateCategories() {
        if (!quotes.length > 0) {
            const paragraph = document.createElement('p')
            paragraph.textContent = "No category available"
            categoryFilter.appendChild(paragraph)
            return;
        }

        const categories = quotes.map(quote => quote.category.toLowerCase())
        console.log(categories);
        const removeDuplicates = new Set(categories)
        removeDuplicates.forEach(category => {
            const option = document.createElement('option')
            option.value = category
            option.innerText = category
            categoryFilter.appendChild(option)

        });



    }


    function filterQuotes(event) {
        filteredQuotes.innerHTML = `<p></p>`
        const selectedCategory = event.target.value
        filterQuotesReal(selectedCategory)
    }

    function filterQuotesReal(selectedCategory) {
        localStorage.setItem('filterValue', JSON.stringify(selectedCategory))
        let filterQuotes = []
        if (selectedCategory === "all") {
            noFilterApplied()
            return;
        }
        filterQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase())
        console.log('filtered quotes ', filterQuotes);
        filterQuotes.forEach((quote) => {
            const paragraph = document.createElement('p')
            paragraph.innerText = quote.text
            filteredQuotes.appendChild(paragraph)
        })
    }

    function noFilterApplied() {
        let filterQuotes = quotes.filter(quote => quote.category.toLowerCase())
        filterQuotes.forEach((quote) => {
            const paragraph = document.createElement('p')
            paragraph.innerText = quote.text
            filteredQuotes.appendChild(paragraph)
        })
    }

    // NEW CODE: Simulate fetching quotes from server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            const data = await response.json();

            // Map JSONPlaceholder posts into our {text, category} format
            const serverQuotes = data.map(post => ({
                text: post.title,
                category: "server"
            }));

            // Conflict resolution: server always wins
            quotes = [...serverQuotes];
            saveQuotes();
            console.log("Quotes synced with server:", quotes);
            notifyUser("Quotes updated from server!");

        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }

    // NEW CODE: Simulate posting a new quote to server
    async function postQuoteToServer(quote) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quote)
            });
            const data = await response.json();
            console.log("Quote sent to server:", data);
        } catch (error) {
            console.error("Error posting quote:", error);
        }
    }


    // NEW CODE: Periodic sync with server
    setInterval(fetchQuotesFromServer, 15000);

    // NEW CODE: Simple notification for user
    function notifyUser(message) {
        alert(message);
    }

    // NEW CODE: Sync local data with server
    async function syncQuotes() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            const data = await response.json();

            // Map posts into our format
            const serverQuotes = data.map(post => ({
                text: post.title,
                category: "server"
            }));

            // Conflict resolution: server wins
            quotes = [...serverQuotes];
            saveQuotes();

            console.log("Quotes synced with server!", quotes);
            notifyUser("Quotes updated from server!");
        } catch (error) {
            console.error("Error syncing quotes:", error);
        }
    }

    setInterval(syncQuotes, 15000);










    // Show a random quote on button click
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', createAddQuoteForm)
    importFile.addEventListener('change', importFromJsonFile)
    exportJson.addEventListener('click', exportToJsonFile)
    categoryFilter.addEventListener('change', filterQuotes)



})

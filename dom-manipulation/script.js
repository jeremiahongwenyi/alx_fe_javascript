document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('newQuoteText');
    const quoteCategory = document.getElementById('newQuoteCategory');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuote');
    const importFile = document.getElementById('importFile');
    const exportJson = document.getElementById('exportJson')



    let quotes = JSON.parse(localStorage.getItem('quotes')) || []
    console.log(quotes);


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
        quotes.push(data)
        console.log(quotes);
        saveQuotes()
        const paragraph = document.createElement('p')
        paragraph.innerText = quoteText.value
        quoteDisplay.appendChild(paragraph)

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




    // Show a random quote on button click
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', createAddQuoteForm)
    importFile.addEventListener('change', importFromJsonFile)
    exportJson.addEventListener('click', exportToJsonFile)



})

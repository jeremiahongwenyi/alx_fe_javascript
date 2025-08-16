document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('newQuoteText');
    const quoteCategory = document.getElementById('newQuoteCategory');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const quotes = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" }
    ];

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes yet. Add one below.</em>";
            return;
        }
        const index = Math.floor(Math.random() * quotes.length); // uses 'random'
        const q = quotes[index];
        quoteDisplay.innerHTML = `
      <blockquote>${q.text}</blockquote>
      <small>${q.category}</small>
    `; // uses 'innerHTML'
    }

    function createAddQuoteForm() {
        // we'll fill this later
    }

    function addQuote() {
        // we'll fill this later
    }

    // Show a random quote on button click
    newQuoteBtn.addEventListener('click', displayRandomQuote);

    // Optionally show one on load
    showRandomQuote();

})
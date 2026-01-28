const newQuoteButton = document.getElementById('js-new-quote');
const answerbutton = document.getElementById('js-tweet');
const shareButton = document.getElementById('js-share');
const endpoint = 'https://api.api-ninjas.com/v1/quotes';

function displayQuote(quoteData) {
    document.getElementById('js-answer-text').innerText = '';
    document.getElementById('js-quote-text').innerText = quoteData[0].quote;
}

function displayAnswer(quoteData) {
    document.getElementById('js-answer-text').innerText = quoteData[0].author;
}

function copyQuote() {
    const quoteText = document.getElementById('js-quote-text').innerText;
    const authorText = document.getElementById('js-answer-text').innerText;
    navigator.clipboard.writeText(quoteText + ' - ' + authorText)
        .then(() => {
            alert('Quote copied to clipboard!');
        })
        .catch((error) => {
            console.error('Error copying quote to clipboard:', error);
            alert('Failed to copy quote.');
        });
}

function getQuote() {
    fetch(endpoint, {
            method: 'GET',
            headers: { "X-Api-Key": "Vb6rFChAtRNIpTcA1/jCig==4M1B60DhftzaEZlp" }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayQuote(data);
            answerbutton.addEventListener('click', () => displayAnswer(data));
            shareButton.addEventListener('click', copyQuote);
        })
        .catch((error) => {
            console.error('Error fetching the quote:', error);
            alert('Oops! Something went wrong while fetching the quote.');
        });
}

newQuoteButton.addEventListener('click', getQuote);

getQuote();
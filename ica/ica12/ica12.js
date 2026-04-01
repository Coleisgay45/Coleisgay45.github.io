const newQuoteButton = document.getElementById('js-new-quote');
const endpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

function displayQuote(quoteData) {
    document.getElementById('js-quote-text').innerText = quoteData.question;
    // document.getElementById('js-answer-text').innerText = quoteData.answer;
}

function getQuote() {
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayQuote(data);
        })
        .catch((error) => {
            console.error('Error fetching the quote:', error);
            alert('Oops! Something went wrong while fetching the quote.');
        });
}

newQuoteButton.addEventListener('click', getQuote);

getQuote();
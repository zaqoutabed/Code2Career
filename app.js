// Information to reach API
const url = "https://dummyjson.com/quotes";

// Selects page elements
const inputField = document.querySelector("#input");
const board = document.querySelector("#board");
let quotes = [];

const fillBoard = (content) => {
    let message = content;
    if (content.length == 0) {
        message = `<h1>Nothing found!</h1>`;
        const searchVal = inputField.value || "";
        if (searchVal.length > 0) {
            message = `<h1>Nothing found!</h1><h1>searching value <b>${searchVal}</b></h1>`;
        }
    }
    board.innerHTML = message;
};

const getFilteredQuotes = () => {
    const searchVal = inputField.value || "";
    if (searchVal) {
        return quotes.filter((quote) => quote.quote?.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()));
    }
    return quotes;
};

const renderResponse = (forError = false) => {
    fillBoard(``);
    if (forError) {
        fillBoard(`<h1 class="err">Failed to fetch data,<br>check your connection!</h1>`)
        return
    }
    const quotes = getFilteredQuotes();
    const quotesLIs = quotes.map(
        (quote) =>
            `<li data-id="${quote.id} data-author="${quote.author}">${quote.quote}</li>`
    );
    fillBoard(quotesLIs.join(""));
};

const getSuggestions = () => {
    fetch(url)
        .then(
            (response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Request failed!");
            },
            (networkError) => {
                console.log(networkError.message);
                renderResponse(forError = true);
            }
        )
        .then((jsonResponse) => {
            quotes = jsonResponse.quotes || [];
            renderResponse();
        }).catch(err => {
            renderResponse(forError = true);
        });
};

inputField,
    addEventListener("change", (ev) => {
        ev.stopPropagation();
        renderResponse();
    });
getSuggestions();

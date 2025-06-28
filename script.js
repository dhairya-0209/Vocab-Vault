const form = document.querySelector('form');
const wordInput = document.getElementById('word');
const resultDiv = document.querySelector('.result');
const wordSuggestions = document.getElementById('word-suggestions');

//word suggest jab 2word type honge uske bad se

wordInput.addEventListener('input', () => {
    const query = wordInput.value;
    if (query.length > 2) {
        fetchWordSuggestions(query);
    } else {
        wordSuggestions.innerHTML = "";
    }
});
//word suggest
const fetchWordSuggestions = async (query) => {
    try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        const suggestions = await response.json();
        wordSuggestions.innerHTML = "";
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion.word;
            wordSuggestions.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching word suggestions:", error);
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(wordInput.value);
});

const getWordInfo = async (word) => {
    try {
        resultDiv.innerHTML = "Fetching Data";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        let definitions = data[0].meanings[0].definitions[0];
        resultDiv.innerHTML = `
        <h2><strong>Word: </strong>${data[0].word}</h2>
        <p class="partOfSpeech">${data[0].meanings[0].partOfSpeech}</p>
        <p><strong>Meaning: </strong>${definitions.definition === undefined ? "Not Found" : definitions.definition}</p>
        <p><strong>Example: </strong>${definitions.example === undefined ? "Not Found" : definitions.example}</p>
        <p><strong>Antonyms: </strong></p>
        `;

        // Fetching Antonym
        if(definitions.antonyms.length === 0){
            resultDiv.innerHTML += `<p>Not Found</p>`;
        } else {
            for(let i = 0; i < definitions.antonyms.length; i++){
                resultDiv.innerHTML += `<li>${definitions.antonyms[i]}</li>`;
            }
        }

        if(definitions.synonyms.length === 0){
            resultDiv.innerHTML += `<p><strong>Synonym </strong> Not Found</p>`;
        } else {
            for(let i = 0; i < definitions.synonyms.length; i++){
                resultDiv.innerHTML += `<p><strong>Synonym: </strong><li>${definitions.synonyms[i]}</li></p>`;
            }
        }

        // adding read more function
        resultDiv.innerHTML += `<div><a href="${data[0].sourceUrls}" target="_blank">Read More</a></div>`;
    } catch (error) {
        resultDiv.innerHTML = `<p>Sorry, The word could not be found</p>`;
    }

    console.log(data);
}

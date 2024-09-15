const inputField = document.getElementById('inputField');
const suggestionsList = document.getElementById('suggestionsList');

let suggestions = [];
let selectedIndex = -1;

inputField.addEventListener('input', () => {
    const userInput = inputField.value.trim();
    const words = userInput.split(/\s+/);
    const lastWord = words[words.length - 1].toLowerCase();
    suggestionsList.innerHTML = '';
    suggestions = [];
    selectedIndex = -1;

    if (lastWord) {
        fetch(`https://api.datamuse.com/words?sp=${lastWord}*`)
            .then(response => response.json())
            .then(data => {
                suggestions = data.slice(0, 5).map(item => item.word);
                suggestions.forEach((word, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = word;
                    listItem.addEventListener('click', () => {
                        selectSuggestion(index);
                    });
                    listItem.addEventListener('mouseover', () => {
                        selectedIndex = index;
                        updateHighlight();
                    });
                    suggestionsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }
});

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default Tab behavior
        if (suggestions.length > 0) {
            if (selectedIndex === -1) {
                selectedIndex = 0; // Select the first suggestion if none is selected
            }
            selectSuggestion(selectedIndex);
        }
    } else if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission if inside a form
        if (selectedIndex >= 0 && suggestions.length > 0) {
            selectSuggestion(selectedIndex);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length > 0) {
            selectedIndex = (selectedIndex + 1) % suggestions.length;
            updateHighlight();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (suggestions.length > 0) {
            selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
            updateHighlight();
        }
    }
});

function selectSuggestion(index) {
    if (index >= 0 && index < suggestions.length) {
        const words = inputField.value.trim().split(/\s+/);
        words.pop();
        words.push(suggestions[index]);
        inputField.value = words.join(' ');
        suggestionsList.innerHTML = '';
        inputField.focus();
        selectedIndex = -1; // Reset selected index after selection
    }
}

function updateHighlight() {
    const items = suggestionsList.querySelectorAll('li');
    items.forEach((item, index) => {
        item.classList.toggle('highlight', index === selectedIndex);
    });
}

function showSuggestions() {
    suggestionsList.classList.remove('fade-out');
    suggestionsList.classList.add('fade-in');
}

function hideSuggestions() {
    suggestionsList.classList.remove('fade-in');
    suggestionsList.classList.add('fade-out');
}

function scrollToHighlighted() {
    const suggestionList = document.getElementById('suggestionsList');
    const highlighted = suggestionList.querySelector('li.highlight');

    if (highlighted) {
        suggestionList.scrollTop = highlighted.offsetTop - suggestionList.clientHeight / 2 + highlighted.clientHeight / 2;
    }
}





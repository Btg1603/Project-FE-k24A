function createCard(cardFront, cardBack, word, meaning) {
    cardFront.innerText = word;
    cardBack.innerText = meaning;
}

function updateCard(cardFront, cardBack, filteredWord, currentIndex) {
    if (filteredWord.length > 0) {
        const wordObj = filteredWord[currentIndex];
        createCard(cardFront, cardBack, wordObj.word, wordObj.meaning);
    } else {
        createCard(cardFront, cardBack, "Không có từ", "Vui lòng chọn danh mục khác");
    }
}

function updateLearnedTable(tableBody, wordList, learnStatus) {
    tableBody.innerHTML = ''; // Clear the table before updating
    wordList.forEach(wordObj => {
        if (learnStatus[wordObj.word]) {
            addToTable(tableBody, wordObj);
        }
    });
    addDeleteAllButton(tableBody, wordList); // Add Delete All button
}

function updateProgressBar(filteredWords, learnStatus) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-bar-container span:last-child');

    const total = filteredWords.length;
    const learned = filteredWords.filter(word => learnStatus[word.word]).length;
    const percent = total ? Math.round((learned / total) * 100) : 0;

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${learned}/${total}`;
}

function addToTable(tableBody, wordObj) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${wordObj.word}</td>
        <td>${wordObj.meaning}</td>
        <td>Learned</td>
    `;
    tableBody.appendChild(row);
}

function addDeleteAllButton(tableBody, wordList) {
    const deleteAllBtn = document.createElement("button");
    deleteAllBtn.classList.add("btn", "btn-danger", "w-100", "mt-3");
    deleteAllBtn.textContent = "Delete All Learned Words";
    deleteAllBtn.addEventListener('click', () => {
        deleteAllLearnedWords(tableBody, wordList);
    });

    tableBody.appendChild(deleteAllBtn);
}

function deleteAllLearnedWords(tableBody, wordList) {
    // Clear all learned words from localStorage
    localStorage.removeItem('learnStatus');
    localStorage.setItem('wordList', JSON.stringify(wordList)); // Restore original wordList

    // Update table and progress bar
    updateLearnedTable(tableBody, wordList, {});
    updateProgressBar(wordList, {});
}

document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('.flip-card');
    const cardFront = document.querySelector('.flip-card-front');
    const cardBack = document.querySelector('.flip-card-back');
    const category = document.querySelector("#categorySelect");
    const nextBtn = document.querySelector(".controls .btn-primary:last-child");
    const prevBtn = document.querySelector(".controls .btn-primary:first-child");
    const tableBody = document.querySelector("tbody");
    const markBtn = document.querySelector(".btn-success");

    // Retrieve wordList and learnStatus from localStorage
    let wordList = JSON.parse(localStorage.getItem('wordList')) || [];
    let learnStatus = JSON.parse(localStorage.getItem('learnStatus')) || {}; // Empty if no status
    let filteredWord = [];
    let currentIndex = 0;

    // Update flashcard display and table
    filteredWord = wordList;
    updateCard(cardFront, cardBack, filteredWord, currentIndex);
    updateLearnedTable(tableBody, filteredWord, learnStatus);
    updateProgressBar(filteredWord, learnStatus);

    // Flip card event
    card.addEventListener('click', function () {
        card.classList.toggle('flip');
    });

    // Category change event
    category.addEventListener("change", () => {
        const selectedCategory = category.value;
        filteredWord = wordList.filter(wordObj =>
            selectedCategory === "All Categories" || wordObj.category === selectedCategory
        );
        currentIndex = 0;
        updateCard(cardFront, cardBack, filteredWord, currentIndex);
        updateLearnedTable(tableBody, filteredWord, learnStatus);
        updateProgressBar(filteredWord, learnStatus);
    });

    // Next button event
    nextBtn.addEventListener("click", () => {
        if (filteredWord.length > 0) {
            currentIndex = (currentIndex + 1) % filteredWord.length;
            updateCard(cardFront, cardBack, filteredWord, currentIndex);
        }
    });

    // Previous button event
    prevBtn.addEventListener("click", () => {
        if (filteredWord.length > 0) {
            currentIndex = (currentIndex - 1 + filteredWord.length) % filteredWord.length;
            updateCard(cardFront, cardBack, filteredWord, currentIndex);
        }
    });

    // Mark as learned button event
    markBtn.addEventListener("click", () => {
        if (filteredWord.length === 0) return;

        const wordObj = filteredWord[currentIndex];
        if (learnStatus[wordObj.word]) return;

        learnStatus[wordObj.word] = true;
        localStorage.setItem('learnStatus', JSON.stringify(learnStatus));

        addToTable(tableBody, wordObj);
        updateProgressBar(filteredWord, learnStatus);
    });
});

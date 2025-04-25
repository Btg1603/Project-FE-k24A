// const wordList = [
//     { word: "abate", meaning: "to reduce in amount, degree, or intensity", category: "Verb", example: "The storm abated after a few hours." },
//     { word: "benevolent", meaning: "well-meaning and kindly", category: "Adjective", example: "She was a benevolent ruler who cared for her people." },
//     { word: "candid", meaning: "truthful and straightforward", category: "Adjective", example: "He gave a candid account of the incident." },
//     { word: "deferential", meaning: "showing respect and esteem due to a superior or elder", category: "Adjective", example: "He was deferential to his elders." },
//     { word: "ebullient", meaning: "cheerful and full of energy", category: "Adjective", example: "Her ebullient personality made her the life of the party." },
//     { word: "facilitate", meaning: "to make an action or process easier", category: "Verb", example: "The new software will facilitate the workflow." },
//     { word: "gregarious", meaning: "fond of company; sociable", category: "Adjective", example: "He was a gregarious person who loved to be around others." },
//     { word: "harangue", meaning: "a lengthy and aggressive speech", category: "Noun", example: "The politician delivered a harangue about the state of the economy." },
//     { word: "ineffable", meaning: "too great or extreme to be expressed in words", category: "Adjective", example: "The beauty of the sunset was ineffable." },
//     { word: "juxtapose", meaning: "to place or deal with close together for contrasting effect", category: "Verb", example: "The artist juxtaposed light and dark colors in her painting." },
//     { word: "kaleidoscope", meaning: "a constantly changing pattern or sequence of elements", category: "Noun", example: "The city was a kaleidoscope of cultures and traditions." },
//     { word: "languid", meaning: "displaying or having a disinclination for physical exertion or effort", category: "Adjective", example: "She felt languid after the long day." },
//     { word: "meticulous", meaning: "showing great attention to detail; very careful and precise", category: "Adjective", example: "He was meticulous in his work, ensuring everything was perfect." },
// ];

// // lưu wordList lên local
// window.localStorage.setItem('wordList', JSON.stringify(wordList));

// lấy dữ liệu từ local
let wordList = JSON.parse(localStorage.getItem('wordList')) || [];
const wordContainer = document.querySelector("tbody");


function render(data) {
    wordContainer.innerHTML = "";
    data.forEach((wordObj, index) => {
        const wordRow = document.createElement("tr");
        wordRow.innerHTML = `
            <td>${wordObj.word}</td>
            <td>${wordObj.meaning}</td>
            <td>${wordObj.category || ''}</td>
            <td class="text-center">
                <button class="btn btn-primary btn-sm" onclick="editWord(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeWord(${index})">Delete</button>
            </td>
        `;
        wordContainer.appendChild(wordRow);
    });
}





function removeWord(index) {
    if (confirm("Are you sure you want to delete this word?")) {
        wordList.splice(index, 1);
        window.localStorage.setItem('wordList', JSON.stringify(wordList));
        render(wordList);
    }
}


function addWord(event) {
    event.preventDefault();
    const form = event.target;
    const newWord = {
        word: form.word.value.trim(),
        meaning: form.meaning.value.trim(),
        category: form.category.value.trim()
    };
    if (newWord.word && newWord.meaning) {
        wordList.push(newWord);
        window.localStorage.setItem('wordList', JSON.stringify(wordList));
        form.reset();
        render();

        document.querySelector('#staticBackdrop .btn-close').click();
        alert("Added successfully");


    } else {
        alert("Please fill in the required fields.");
    }
}   

render(wordList);

// function editWord(index) {
//     const wordObj = wordList[index];
//     const tr = document.querySelectorAll("tbody tr")[index];
//     tr.innerHTML = `
//         <td><input type="text" class="form-control" value="${wordObj.word}" id="wordEdit"></td>
//         <td><input type="text" class="form-control" value="${wordObj.meaning}" id="meaningEdit"></td>
//          <select id="categoryEdit" class="form-select">
//                 <option selected>All Categories</option>
//                 <option value="Verb">Verb</option>
//                 <option value="Noun">Noun</option>
//                 <option value="Adjective">Adjective</option>
//                 <option value="Averb">Adverb</option>
//         </select>
//         <td class="text-center">
//             <button class="btn btn-success btn-sm" onclick="saveWord(${index})">Save</button>
//             <button class="btn btn-danger btn-sm" onclick="removeWord(${index})">Delete</button>
//         </td>
//     `;   
// }

// Edit Word Function
function editWord(index) {
    const wordObj = wordList[index];

    // Set the form values in the modal
    document.getElementById("wordEdit").value = wordObj.word;
    document.getElementById("meaningEdit").value = wordObj.meaning;
    document.getElementById("categoryEdit").value = wordObj.category;

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();

    // Handle save changes
    document.getElementById("saveChanges").onclick = function () {
        saveWord(index);
        editModal.hide(); // Close modal after saving
    };
}


// Save Word Function (After Editing)
function saveWord(index) {
    const word = document.getElementById("wordEdit").value.trim();
    const meaning = document.getElementById("meaningEdit").value.trim();
    const category = document.getElementById("categoryEdit").value.trim();

    if (word && meaning) {
        wordList[index] = { word, meaning, category }; // Update word list
        localStorage.setItem('wordList', JSON.stringify(wordList)); // Save to localStorage
        render(wordList); // Re-render the list
        alert("Word updated successfully.");
    } else {
        alert("Please fill in all fields.");
    }
}

  

function saveWord(index) {
    const word=document.getElementById("wordEdit").value;
    const meaning=document.getElementById("meaningEdit").value;
    const category=document.getElementById("categoryEdit").value;

    if (word && meaning) {
        wordList[index] = {
            word: word,
            meaning: meaning,
            category: category
        };
        window.localStorage.setItem('wordList', JSON.stringify(wordList));
        render(wordList);
        alert("Updated successfully");
    } else {
        alert("Please fill in the required fields.");
    }   
}

// function searchWord(){
//     const searchInput = document.getElementById("searchInput").value.toLowerCase();
//     const filteredWords = wordList.filter(wordObj => 
//         wordObj.word.toLowerCase().includes(searchInput) || 
//         wordObj.meaning.toLowerCase().includes(searchInput)
//     );
//     wordContainer.innerHTML = "";
//     filteredWords.forEach((wordObj, index) => {
//         const wordRow = document.createElement("tr");
//         wordRow.innerHTML = `
//             <td>${wordObj.word}</td>
//             <td>${wordObj.meaning}</td>
//             <td>${wordObj.category || ''}</td>
//             <td class="text-center">
//                 <button id="edit" class="btn btn-primary btn-sm" onclick="editWord(${index})">Edit</button>
//                 <button class="btn btn-danger btn-sm" onclick="removeWord(${index})">Delete</button>
//             </td>
//         `;
//         wordContainer.appendChild(wordRow);
//     });
// }


document.querySelector("#searchInput").addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const filteredWord = wordList.filter(wordObj => {
        return wordObj.word.toLowerCase().includes(keyword) ||
               wordObj.meaning.toLowerCase().includes(keyword) ||
               wordObj.category.toLowerCase().includes(keyword);
    });
    render(filteredWord);
});


// lọc danh mục
// Lắng nghe sự kiện thay đổi tìm kiếm và lọc danh mục
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

searchInput.addEventListener("input", filterWords);
categorySelect.addEventListener("change", filterWords);






function render(filteredData) {
    wordContainer.innerHTML = "";

    filteredData.forEach((wordObj, index) => {
        const wordRow = document.createElement("tr");
        wordRow.innerHTML = `
            <td>${wordObj.word}</td>
            <td>${wordObj.meaning}</td>
            <td>${wordObj.category || ''}</td>
            <td class="text-center">
                <button class="btn btn-primary btn-sm" onclick="editWord(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeWord(${index})">Delete</button>
            </td>
        `;
        wordContainer.appendChild(wordRow);
    });
}






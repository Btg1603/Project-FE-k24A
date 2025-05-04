// const wordList = [
//     { word: "tree", meaning: "a perennial plant with an elongated stem, or trunk", category: "Cây cối", example: "The tree provided shade on a hot day." },
//     { word: "river", meaning: "a large natural stream of water flowing in a channel to the sea, a lake, or another river", category: "Thiên nhiên", example: "The river flows through the valley." },
//     { word: "lion", meaning: "a large tawny-colored cat that lives in prides, found in Africa and northwestern India", category: "Con vật", example: "The lion is known as the king of the jungle." },
//     { word: "car", meaning: "a road vehicle, typically with four wheels, powered by an internal combustion engine", category: "Phương tiện", example: "He drove his car to work every day." },
//     { word: "flower", meaning: "the seed-bearing part of a plant, consisting of reproductive organs", category: "Cây cối", example: "The flower bloomed beautifully in the garden." },
//     { word: "mountain", meaning: "a large natural elevation of the earth's surface rising abruptly from the surrounding level", category: "Thiên nhiên", example: "They climbed the mountain during their vacation." },
//     { word: "elephant", meaning: "a large herbivorous mammal with a trunk, native to Africa and Asia", category: "Con vật", example: "The elephant used its trunk to grab the fruit." },
//     { word: "bicycle", meaning: "a vehicle composed of two wheels held in a frame one behind the other, propelled by pedals", category: "Phương tiện", example: "She rode her bicycle to the park." },
//     { word: "bush", meaning: "a shrub or clump of shrubs with stems of moderate length", category: "Cây cối", example: "The bush was full of berries." },
//     { word: "ocean", meaning: "a very large expanse of sea", category: "Thiên nhiên", example: "The ocean stretched as far as the eye could see." },
//     { word: "dog", meaning: "a domesticated carnivorous mammal that typically has a long snout and an acute sense of smell", category: "Con vật", example: "The dog barked loudly at the stranger." },
//     { word: "train", meaning: "a series of connected vehicles that run on a track and are designed to transport people or goods", category: "Phương tiện", example: "The train arrived at the station on time." },
// ];

// // lưu wordList lên local
// window.localStorage.setItem('wordList', JSON.stringify(wordList));

// Lấy dữ liệu từ local
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

render(wordList);

function showNotification(message) {
    const notificationModal=new bootstrap.Modal(document.getElementById('notificationModal'));
    const notificationBody=document.getElementById('notificationModalBody');
    notificationBody.textContent=message;
    notificationModal.show();
}


function removeWord(index) {
    const confirmModal=new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    confirmModal.show();

    document.getElementById('confirmDeleteBtn').onclick=()=>{
        wordList.splice(index,1);
        localStorage.setItem('wordList',JSON.stringify(wordList));
        render(wordList);
        confirmModal.hide();

        showNotification("Deleted successfully");
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
        render(wordList);

        document.querySelector('#staticBackdrop .btn-close').click();
        showNotification("Added successfully");


    } else {
        showNotification("Please fill in the required fields.");
    }
}   



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

function editWord(index) {
    const wordObj = wordList[index];


    document.getElementById("wordEdit").value = wordObj.word;
    document.getElementById("meaningEdit").value = wordObj.meaning;
    document.getElementById("categoryEdit").value = wordObj.category;

    // hiện modal sửa
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();

    // tạo sự kiện cho nút lưu trong modal
    document.getElementById("saveChanges").onclick = function () {
        saveWord(index);
        editModal.hide(); 
    };
}



function saveWord(index) {
    const word = document.getElementById("wordEdit").value.trim();
    const meaning = document.getElementById("meaningEdit").value.trim();
    const category = document.getElementById("categoryEdit").value.trim();

    if (word && meaning) {
        wordList[index] = { word, meaning, category }; 
        localStorage.setItem('wordList', JSON.stringify(wordList));
        render(wordList); 
        showNotification("Word updated successfully.");
    } else {
        showNotification("Please fill in all fields.");
    }
}


// tìm kiếm
const searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const filteredWord = wordList.filter(wordObj => {
        return wordObj.word.toLowerCase().includes(keyword) ||
               wordObj.meaning.toLowerCase().includes(keyword) ||
               wordObj.category.toLowerCase().includes(keyword);
    });
    render(filteredWord);
});

// lọc theo danh mục
const category=document.querySelector("#categorySelect")
category.addEventListener("change", () => {
    const selectedCategory = category.value;
    const filteredWord = wordList.filter(wordObj => {
        return selectedCategory === "All Categories" || wordObj.category === selectedCategory;
    });
    render(filteredWord);
});







const pagination = document.querySelector(".pagination");
const itemsPerPage = 5;
let currentPage = 1;
let totalPages = 1;

function renderPage(data, page = 1) {
    wordContainer.innerHTML = "";
    totalPages = Math.ceil(data.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentData = data.slice(start, end);

    currentData.forEach((wordObj, index) => {
        const wordRow = document.createElement("tr");
        wordRow.innerHTML = `
            <td>${wordObj.word}</td>
            <td>${wordObj.meaning}</td>
            <td>${wordObj.category || ''}</td>
            <td class="text-center">
                <button class="btn btn-primary btn-sm" onclick="editWord(${start + index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeWord(${start + index})">Delete</button>
            </td>
        `;
        wordContainer.appendChild(wordRow);
    });

    updatePaginationControls();
}

renderPage(wordList, currentPage);


function updatePaginationControls() {
    pagination.innerHTML = "";

    // Previous
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    // Next
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
}

function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderPage(wordList, currentPage);
    }
}




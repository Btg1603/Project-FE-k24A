const wordContainer = document.querySelector('tbody');
// Lấy wordList và categoryList từ localStorage (nếu có)
const wordList = JSON.parse(localStorage.getItem('wordList')) || [];
const categoryList = JSON.parse(localStorage.getItem('categoryList')) || [];
wordList.forEach(word => {
    if (!categoryList.some(words => words.name === word.category)) {
        categoryList.push({
            name: word.category,
            description: ""
        });
    }
});
console.log(categoryList);

//lưu lên local
localStorage.setItem('categoryList', JSON.stringify(categoryList));



// Hàm render categoryList
function renderCategories(categoryList) {
    wordContainer.innerHTML = "";  // Clear table before re-render

    categoryList.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${category.name}</td>
        <td>${category.description}</td>
        <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editCategory(${index})">Edit</button>
            <button class="btn btn-danger" onclick="removeCategory(${index})">Delete</button>
        </td>
        `;
        wordContainer.appendChild(row);
    });
}
renderCategories(categoryList);






function addCategory(event) {
    event.preventDefault();
    const form = event.target;
    const newCategory = form.name.value.trim();
    const newDescription = form.description.value.trim();

    if (newCategory && newDescription) {
        if (!categoryList.some(category => category.name === newCategory)) {
            // wordList.push({ name: newCategory, description: newDescription });
            categoryList.push({ name: newCategory, description: newDescription });


            // localStorage.setItem('wordList', JSON.stringify(wordList));
            localStorage.setItem('categoryList', JSON.stringify(categoryList));


            form.reset();
            renderCategories(categoryList);


            document.querySelector('#staticBackdrop .btn-close').click();
            showNotification("Category added successfully");

        } else {
            showNotification("This category already exists.");

        }
    } else {
        showNotification("Please fill in all the required fields.");

    }
}




renderCategories(categoryList);

function showNotification(message) {
    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    const notificationBody = document.getElementById('notificationModalBody');
    notificationBody.textContent = message;
    notificationModal.show();
}



function removeCategory(index) {
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmModal.show();

    document.getElementById('confirmDeleteBtn').onclick = () => {
        categoryList.splice(index, 1);
        localStorage.setItem('categoryList', JSON.stringify(categoryList));
        renderCategories(categoryList);
        confirmModal.hide();

        showNotification("Category deleted successfully");
    };
}

const searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const filteredCategories = categoryList.filter(category => {
        return category.name.toLowerCase().includes(keyword) ||
               category.description.toLowerCase().includes(keyword);
    });
    renderCategories(filteredCategories);
});




const pagination = document.querySelector(".pagination");
const itemsPerPage = 3;
let currentPage = 1;
let totalPages = 1;

function renderPage(data, page = 1) {
    wordContainer.innerHTML = "";
    totalPages = Math.ceil(data.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentData = data.slice(start, end);

    currentData.forEach((categoryObj, index) => {
        const categoryRow = document.createElement("tr");
        categoryRow.innerHTML = `
            <td>${categoryObj.name}</td>
            <td>${categoryObj.description}</td>
            <td>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editCategory(${start + index})">Edit</button>
                <button class="btn btn-danger" onclick="removeCategory(${start + index})">Delete</button>
            </td>
        `;
        wordContainer.appendChild(categoryRow);
    });

    updatePaginationControls();
}

renderPage(categoryList, currentPage);

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
        renderPage(categoryList, currentPage);
    }
}






function editCategory(index) {
    const category = categoryList[index];
    const editForm = document.getElementById('editForm');

    if (!editForm) {
        console.log("Edit form not found");
        return;
    }

    const nameInput = document.getElementById('categoryEdit');
    const descriptionInput = document.getElementById('descriptionEdit');

    if (!nameInput ) {
        console.log("Edit form fields not found");
        return;
    }

    nameInput.value = category?.name || '';
    descriptionInput.value = category?.description || '';

    editForm.dataset.index = index; 
}


function saveEdit(event) {
    event.preventDefault();
    const form = event.target;
    const index = form.dataset.index;

    if (index === undefined || index === null) {
        alert("Error: Unable to identify the category to edit.");
        return;
    }

    const nameInput = document.getElementById('categoryEdit');
    const descriptionInput = document.getElementById('descriptionEdit');

    const updatedName = nameInput.value.trim();
    const updatedDescription = descriptionInput.value.trim();

    if (updatedName && updatedDescription) {
        categoryList[index].name = updatedName;
        categoryList[index].description = updatedDescription;

        localStorage.setItem('categoryList', JSON.stringify(categoryList));
        renderCategories(categoryList);

        const closeButton = document.querySelector('#editModal .btn-close');
        if (closeButton) {
            closeButton.click();
        }

        form.reset();
        showNotification("Category updated successfully");

    } else {
        showNotification("Error: Unable to identify the category to edit.");

    }
}





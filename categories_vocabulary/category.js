const wordContainer = document.querySelector('tbody');
// Lấy wordList và categoryList từ localStorage (nếu có)
const wordList = JSON.parse(localStorage.getItem('wordList')) || [];
const categoryList = JSON.parse(localStorage.getItem('categoryList')) || [];
wordList.forEach(word => {
    if (!categoryList.includes(word.category)) {
        categoryList.push(word.category);
    }
});

//lưu lên local
localStorage.setItem('categoryList', JSON.stringify(categoryList));



// Hàm render categoryList
function renderCategories() {
    wordContainer.innerHTML = "";  // Clear table before re-render

    categoryList.forEach((category, index) => {
        // Lọc các từ có category tương ứng
        const categoryWords = wordList.filter(word => word.category === category);
        
        // Tạo một dòng mới cho mỗi category
        const row = document.createElement('tr');
        row.className = 'word-item';
        row.innerHTML = `
            <td>${category}</td>
            <td>${categoryWords.map(word => word.description).join(', ')}</td> 
            <td class="text-center">
                <button class="btn btn-primary btn-sm" onclick="editCategory(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeCategory(${index})">Delete</button>
            </td>
        `;
        wordContainer.appendChild(row);
    });
}
renderCategories();






function addCategory(event) {
    event.preventDefault();
    const form = event.target;
    const newCategory = form.name.value.trim();
    const newDescription = form.description.value.trim();

    if (newCategory && newDescription) {
        if (!categoryList.includes(newCategory)) {
            wordList.push({ category: newCategory, description: newDescription });
            categoryList.push(newCategory);

           
            // localStorage.setItem('wordList', JSON.stringify(wordList));
            localStorage.setItem('categoryList', JSON.stringify(categoryList));

         
            form.reset();
            renderCategories();

           
            document.querySelector('#staticBackdrop .btn-close').click();
            alert("Category added successfully");
        } else {
            alert("This category already exists.");
        }
    } else {
        alert("Please fill in all the required fields.");
    }
}



renderCategories();


function removeCategory(index) {
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
        const categoryToRemove = categoryList[index];

        // Xóa trong wordList
        // const newWordList = wordList.filter(word => word.category !== categoryToRemove);
        // localStorage.setItem('wordList', JSON.stringify(newWordList));

        // Xóa trong categoryList
        categoryList.splice(index, 1);
        localStorage.setItem('categoryList', JSON.stringify(categoryList));
        renderCategories();
    }
}






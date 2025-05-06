
const questions = [
    {
        question: "What is the meaning of 'tree'?",
        options: ["Con mèo", "Cái cây", "Xe hơi", "Con cá"],
        answer: "Cái cây",
        category: "Cây cối"
    },
    {
        question: "What is the meaning of 'cat'?",
        options: ["Con mèo", "Con chó", "Con gà", "Con heo"],
        answer: "Con mèo",
        category: "Con vật"
    },
    {
        question: "What is the meaning of 'car'?",
        options: ["Xe hơi", "Xe đạp", "Xe lửa", "Xe máy"],
        answer: "Xe hơi",
        category: "Phương tiện"
    },
    {
        question: "What is the meaning of 'river'?",
        options: ["Con suối", "Con sông", "Cái ao", "Cái hồ"],
        answer: "Con sông",
        category: "Thiên nhiên"
    }
];

let quizIndex = 0;
let score = 0;
let selectedCategory = "All Categories";

// ==== DOM ELEMENTS ====
const startBtn = document.querySelector("button[data-bs-target='#staticBackdrop']");
const quizContainer = document.querySelector(".quiz-body");
const tableBody = document.querySelector("tbody");
const categorySelect = document.getElementById("categorySelect");

// ==== BẮT ĐẦU BÀI QUIZ ====
function startQuiz() {
    quizIndex = 0;
    score = 0;
    renderQuestion();
}

// ==== RENDER CÂU HỎI ====
function renderQuestion() {
    const filtered = getFilteredQuestions();
    if (quizIndex >= filtered.length) return showResult(filtered.length);

    const current = filtered[quizIndex];
    quizContainer.innerHTML = `
        <div class="mb-4">
            <h5 class="fw-bold">Question ${quizIndex + 1}/${filtered.length}:</h5>
            <p class="mb-3">${current.question}</p>
            <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: ${(quizIndex / filtered.length) * 100}%"></div>
            </div>
            <div class="list-group">
                ${current.options.map(opt => `
                    <button class="list-group-item list-group-item-action" onclick="checkAnswer(this, '${current.answer}')">${opt}</button>
                `).join("")}
            </div>
        </div>
    `;
}

// ==== KIỂM TRA ĐÁP ÁN ====
function checkAnswer(btn, correctAnswer) {
    const buttons = document.querySelectorAll(".list-group-item");
    buttons.forEach(b => {
        b.disabled = true;
        if (b.innerText === correctAnswer) {
            b.classList.add("list-group-item-success");
        } else if (b.innerText === btn.innerText) {
            b.classList.add("list-group-item-danger");
        }
    });

    if (btn.innerText === correctAnswer) score++;

    setTimeout(() => {
        quizIndex++;
        renderQuestion();
    }, 1000);
}

// ==== KẾT THÚC QUIZ VÀ HIỂN THỊ KẾT QUẢ ====
function showResult(total) {
    const percent = Math.round((score / total) * 100);
    quizContainer.innerHTML = `
        <div class="text-center">
            <h4 class="fw-bold">🎉 Quiz Completed!</h4>
            <p>Your score: <strong>${score}/${total} (${percent}%)</strong></p>
            <button class="btn btn-success" data-bs-dismiss="modal">Finish</button>
        </div>
    `;
    saveToHistory(score, total);
    renderHistory();
}

// ==== LỌC THEO DANH MỤC ====
function getFilteredQuestions() {
    return selectedCategory === "All Categories"
        ? questions
        : questions.filter(q => q.category === selectedCategory);
}

// ==== LƯU KẾT QUẢ VÀO LỊCH SỬ ====
function saveToHistory(score, total) {
    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    history.push({
        date: new Date().toLocaleString(),
        category: selectedCategory,
        score: `${score}/${total}`
    });
    localStorage.setItem("quizHistory", JSON.stringify(history));
}

// ==== HIỂN THỊ LỊCH SỬ ====
function renderHistory() {
    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    const filtered = selectedCategory === "All Categories"
        ? history
        : history.filter(h => h.category === selectedCategory);

    tableBody.innerHTML = filtered.map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${item.category}</td>
            <td class="text-center">${item.score}</td>
        </tr>
    `).join("");
}

// ==== SỰ KIỆN ====
startBtn.addEventListener("click", startQuiz);

categorySelect.addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    renderHistory();
});

// ==== LOAD LỊCH SỬ KHI MỚI VÀO ====
renderHistory();

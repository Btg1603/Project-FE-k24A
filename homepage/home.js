// Lấy các phần tử cần thiết
const logoutButton = document.getElementById('logout');
const title = document.getElementById('title');
const authMode = localStorage.getItem('authMode');
const currentUser = JSON.parse(localStorage.getItem('userLogining'));

// Hiển thị nút Logout nếu đã đăng nhập
if (authMode === 'login') {
  logoutButton.classList.remove('d-none');
}

// Hiển thị nội dung theo trạng thái đăng nhập / đăng xuất
if (authMode !== 'login' || !currentUser) {
  title.innerHTML = `
    <h1>Welcome to VocabApp</h1>
    <p>Learn and practice vocabulary with flashcards and quizzes</p>
    <a id="start" class="btn btn-outline-primary" href="../authen_login_logout/">Get Started</a>
    <a id="create" class="btn btn-outline-success" href="../authen_login_logout/">Create Account</a>
  `;
} else {
  title.innerHTML = `
    <h1>Chào Mừng Bạn Đã Quay Lại Học ${currentUser.lastName}</h1>
    <p>Tiếp tục học từ vựng và cải thiện kỹ năng của bạn hôm nay</p>
    <a id="start" class="btn btn-outline-success" href="../Quiz/">Start Quiz</a>
  `;
}

// Xử lý đăng xuất
logoutButton.addEventListener('click', function () {
  const confirmLogout = confirm('Bạn có chắc chắn muốn đăng xuất không?');
  if (confirmLogout) {
    localStorage.setItem('authMode', 'logout');
    localStorage.removeItem('userLogining'); 
    window.location.href = '/authen_login_logout/';
  }
});

// Chặn truy cập trái phép vào các mục được bảo vệ
const protectedLinks = document.querySelectorAll('.menu a:not([href*="authen_login_logout"])');

protectedLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const mode = localStorage.getItem('authMode');
    if (mode !== 'login') {
      e.preventDefault();
      alert('Bạn cần đăng nhập để truy cập mục này!');
      window.location.href = '/authen_login_logout/';
    }
  });
});

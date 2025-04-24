const logoutButton = document.getElementById('logout');
const authMode = localStorage.getItem('authMode'); 
if (authMode === 'login') {
  logoutButton.classList.remove('d-none'); 
}


logoutButton.addEventListener('click', function () {
  localStorage.setItem('authMode', 'logout');
  window.location.href = '/authen_login_logout/';
});







  // // Hiện nút logout nếu đang login
  // if (authMode === 'login') {
  //   logoutButton.classList.remove('d-none');
  // }

  // Xử lý đăng xuất
  logoutButton.addEventListener('click', function () {
    const confirmLogout = confirm('Bạn có chắc chắn muốn đăng xuất không?');
    if (confirmLogout) {
      localStorage.setItem('authMode', 'logout');
      localStorage.removeItem('currentUser');
      window.location.href = '/authen_login_logout/';
    }
  });

  // Chặn truy cập khi chưa đăng nhập
  const protectedLinks = document.querySelectorAll('.menu a:not([href*="authen_login_logout"])');

  protectedLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      if (localStorage.getItem('authMode') !== 'login') {
        e.preventDefault();
        alert('Bạn cần đăng nhập để truy cập mục này!');
        window.location.href = '/authen_login_logout/';
      }
    });
  });


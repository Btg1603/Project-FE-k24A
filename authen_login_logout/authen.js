const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});



let users = JSON.parse(localStorage.getItem('users') || '[]');




document.getElementById('registerForm').addEventListener('submit', function (e) {
	e.preventDefault();

	const firstName = document.getElementById('firstName').value.trim();
	const lastName = document.getElementById('lastName').value.trim();
	const email = document.getElementById('email').value.trim();
	const password = document.getElementById('password').value;
	const confirmPassword = document.getElementById('confirmPassword').value;

	let isValid = true;



	document.querySelectorAll('.error').forEach(e => e.innerText = '');


	if (!firstName) {
		document.getElementById('firstNameError').innerText = 'First Name không được để trống';
		isValid = false;
	}

	
	if (!lastName) {
		document.getElementById('lastNameError').innerText = 'Last Name không được để trống';
		isValid = false;
	}


	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		document.getElementById('emailError').innerText = 'Email không đúng định dạng';
		isValid = false;
	} else {
		const isEmailExists = users.some(user => user.email === email);
		if (isEmailExists) {
			document.getElementById('emailError').innerText = 'Email đã tồn tại';
			isValid = false;
		}
	}

	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
	if (!passwordRegex.test(password)) {
		document.getElementById('passwordError').innerText = 'Password phải có ít nhất 8 ký tự, gồm in hoa, in thường, và số';
		isValid = false;
	}

	if (password !== confirmPassword) {
		document.getElementById('confirmPasswordError').innerText = 'Confirm Password phải giống Password';
		isValid = false;
	}

	
	if (isValid) {
		const newUser = { firstName, lastName, email, password };
		users.push(newUser);
		localStorage.setItem('users', JSON.stringify(users));
		alert('Đăng ký thành công!');
		localStorage.setItem('authMode', 'login');
		window.location.href ='/homepage/';
	}
});



document.getElementById('loginForm').addEventListener('submit', function (e) {
	e.preventDefault();
	const email = document.getElementById('loginEmail').value.trim();
	const password = document.getElementById('loginPassword').value;

	let isValid = true;

	document.querySelectorAll('.error').forEach(e => e.innerText = '');

	if (!email) {
		document.getElementById('loginEmailError').innerText = 'Email không được để trống';
		isValid = false;
	}
	if (!password) {
		document.getElementById('loginPasswordError').innerText = 'Password không được để trống';
		isValid = false;
	}
	if (isValid) {
		const users = JSON.parse(localStorage.getItem('users') || '[]');
		const user = users.find(user => user.email === email && user.password === password);
		if (user) {
			alert('Đăng nhập thành công!');
			localStorage.setItem('authMode', 'login');
			window.location.href ='/homepage/';
		} else {
			document.getElementById('loginError').innerText = 'Email hoặc Password không đúng';
		}
	}	
});




function setupTogglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    toggle.addEventListener("click", () => {
        const type = input.type === "password" ? "text" : "password";
        input.type = type;


        toggle.classList.toggle("fa-eye");
        toggle.classList.toggle("fa-eye-slash");
    });
}

setupTogglePassword("password", "togglePassword1");
setupTogglePassword("confirmPassword", "togglePassword2");
setupTogglePassword("loginPassword", "togglePassword3");



import {
	DRIVER_PATH,
	LOGIN_PATH, PASSENGER_PATH, PROPERTY_AUTH_TOKEN, PROPERTY_USER, SIGNUP_PATH, USER_TYPE_DRIVER, USER_TYPE_PASSENGER,
	WELCOME_PATH
} from "./variable_constants";

if (location.pathname !== LOGIN_PATH
	&& location.pathname !== SIGNUP_PATH
	&& location.pathname !== WELCOME_PATH
	&& location.pathname !== "/" ) {

	if (!localStorage.getItem(PROPERTY_AUTH_TOKEN)
		|| !localStorage.getItem(PROPERTY_USER)) {

		location.href = LOGIN_PATH;
	}
	else{
		const user = JSON.parse(localStorage.getItem(PROPERTY_USER));

		if (user.user_type === USER_TYPE_DRIVER
			&& !location.pathname.toLocaleLowerCase().includes("driver")
			&& !location.pathname.toLocaleLowerCase().includes("about")) {
			location.href = DRIVER_PATH;

		}else if (user.user_type === USER_TYPE_PASSENGER
			&& !location.pathname.toLocaleLowerCase().includes("passenger")
			&& !location.pathname.toLocaleLowerCase().includes("about")) {
			location.href = PASSENGER_PATH;
		}
		let lgout = document.getElementById("logout");
		lgout.insertAdjacentText("afterBegin", user.full_name);
	}
}

require("./modal");
const login = require("./login");
const logout = require("./logout");
const signup = require("./signup");


// document event listeners definitions

const login_form = document.getElementById("form-sign-in");
const signup_form = document.getElementById("form-sign-up");
const logout_button = document.getElementById("logout");
const about_button = document.getElementById("about");

if (login_form){
	login_form.addEventListener("submit", (form) => login.login(form));
}
if (signup_form){
	signup_form.addEventListener("submit", (form) => signup.signup(form));
}
if (logout_button){
	logout_button.addEventListener("click", (event) => logout.logout(event));
}
if (about_button){
	about_button.addEventListener("click", (event) => {
		event.preventDefault();
		const user = JSON.parse(localStorage.getItem(PROPERTY_USER));

		if (user.user_type === USER_TYPE_DRIVER) {
			location.href = DRIVER_PATH;

		}else if (user.user_type === USER_TYPE_PASSENGER) {
			location.href = PASSENGER_PATH;
		}
	});
}

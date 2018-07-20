import {validatePassword} from "../extras/main";
import {LOGIN_URL, PROPERTY_USER, USER_TYPE_DRIVER, USER_TYPE_PASSENGER} from "../extras/variable_constants";
import {http_service} from "../services/commons.service";

let login = async (form) => {

	form.preventDefault();
	form = form.target;

	let username = form.inputUsername;
	let password = form.inputPassword;

	let error_panel = document.getElementById("loginError");
	let username_error = document.getElementById("usernameError");
	let password_error = document.getElementById("passwordError");

	username_error.style.display = "none";
	password_error.style.display = "none";
	error_panel.style.display = "none";

	if (username.value.length > 3) {
		if (validatePassword(password.value)) {

			const data = {
				username: username.value,
				password: password.value
			};
			let response = await http_service(LOGIN_URL, "POST", data);
			if (typeof response === "boolean" && response) {
				let user = JSON.parse(localStorage.getItem(PROPERTY_USER));

				if (!user) {
					error_panel.innerHTML = "<b>Please clear your browsers cache and login again.. </b>";
					error_panel.style.display = "block";
					return false;
				}

				if (user.user_type === USER_TYPE_PASSENGER) {
					location.assign("passenger/index.html");

				} else if (user.user_type === USER_TYPE_DRIVER) {
					location.assign("driver/index.html");
				}
				return true;
			} else {
				response.json().then((response) => {
					if (response.hasOwnProperty("error_message")) {
						error_panel.innerHTML = `<b>${response.error_message}</b>`;
						error_panel.style.display = "block";
					}
					return false;
				});
				return false;
			}
		}
		password_error.style.display = "block";
		return false;
	}
	username_error.style.display = "block";
	return false;
};

module.exports = {
	login: login
};
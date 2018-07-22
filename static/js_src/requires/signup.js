import {validateContact, validatePassword} from "../extras/main.utils";
import {SIGNUP_URL} from "../extras/constant.variables";
import {http_service} from "../services/commons.service";

let signup = async (form) => {

	form.preventDefault();
	form = form.target;

	const username = form.inputUsername;
	const password = form.inputPassword;
	const user_type = form.userType;
	const fullname = form.inputName;
	const contact = form.inputPhone;

	let error_panel = document.getElementById("loginError");
	let success_panel = document.getElementById("signupSuccess");
	let username_error = document.getElementById("usernameError");
	let password_error = document.getElementById("passwordError");
	let name_error = document.getElementById("nameError");
	let contact_error = document.getElementById("contactError");

	username_error.style.display = "none";
	password_error.style.display = "none";
	name_error.style.display = "none";
	contact_error.style.display = "none";
	error_panel.style.display = "none";
	success_panel.style.display = "none";

	if (fullname.value.length > 3) {
		if (username.value.length > 3) {
			if (validateContact(contact.value)) {
				if (validatePassword(password.value)) {

					const data = {
						full_name: fullname.value,
						contact: contact.value,
						user_type: user_type.value,
						username: username.value,
						password: password.value
					};
					let response = await http_service(SIGNUP_URL, "POST", data);

					if (response && response.hasOwnProperty("success_message")) {

						success_panel.innerHTML = response.success_message;
						success_panel.style.display = "block";
						error_panel.style.display = "none";

					} else {
						response.json().then((response) => {
							if (response
								&& response.hasOwnProperty("error_message")
								&& response.hasOwnProperty("data")) {

								error_panel.innerHTML = `${response.error_message} <br> ${response.data ? response.data : ""}`;
								error_panel.style.display = "block";
							} else {
								error_panel.innerHTML = "Unknown error. consult the administrator";
								error_panel.style.display = "block";

								return false;
							}
						});
					}
					return true;
				}
				password_error.style.display = "block";
				return false;
			}
			contact_error.style.display = "block";
			return false;
		}
		username_error.style.display = "block";
		return false;
	}
	name_error.style.display = "block";
	return false;
};

module.exports = {
	signup: signup
};
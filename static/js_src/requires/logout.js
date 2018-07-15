
import {LOGOUT_URL, WELCOME_PATH} from "./extras/variable_constants";
import {logout_service} from "./services/commons.service";

let logout = async (event) => {
	event.preventDefault();

	if (confirm("Are you sure you want to log out?")) {

		let response = await logout_service(LOGOUT_URL);

			if ((typeof response === "boolean"
				&& response)
				|| response.ok
				|| response.status === 401){

				location.href = WELCOME_PATH;
				return true;
			}

			let resp = response.json();
			if (resp.hasOwnProperty("message")) {
				alert(`${resp.message}`);
			}
			return false;
	}
	return false;
};

module.exports = {
	logout: logout
};


import {HEADERS, LOGOUT_URL, PROPERTY_AUTH_TOKEN} from "../variable_constants";

export let logout_service = () => {

	HEADERS["Authorization"] = `JWT ${localStorage.getItem(PROPERTY_AUTH_TOKEN)}`;

	return fetch(LOGOUT_URL,
		{
			method: "POST",
			headers: HEADERS,
		})
		.then(response => {
			const regExp = /^2[0-9].*$/;

			if (regExp.test(response.status)) {
				return Promise.resolve(response);
			}else {
				return Promise.reject(response);
			}
		})
		.then(response => response.json()) // parse response as JSON
		.then(data => {
			// success
			console.log(data);
			localStorage.clear();
			return true;
		})
		.catch(function (error) {
			return error;
		});
};

import {PROPERTY_AUTH_TOKEN, LOGIN_URL, PROPERTY_USER, HEADERS} from "../variable_constants";

export let login_service = (data) => {

	return fetch(LOGIN_URL,
		{
			method: "POST",
			headers: HEADERS,
			body: JSON.stringify(data)
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
			if (data.hasOwnProperty(PROPERTY_AUTH_TOKEN)) {
				localStorage.setItem(PROPERTY_AUTH_TOKEN, data[PROPERTY_AUTH_TOKEN]);
			}
			if (data.hasOwnProperty(PROPERTY_USER)) {
				localStorage.setItem(PROPERTY_USER, JSON.stringify(data[PROPERTY_USER]));
			}
			return true;
		})
		.catch(function (error) {
			return error.json();
		});
};
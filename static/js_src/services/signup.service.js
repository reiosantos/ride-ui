
import {HEADERS, SIGNUP_URL} from "../variable_constants";

export let signup_service = (data) => {

	return fetch(SIGNUP_URL,
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
			return data;
		})
		.catch(function (error) {
			return error.json();
		});
};
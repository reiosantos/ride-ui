
import {
	HEADERS, LOGIN_PATH, LOGIN_URL, LOGOUT_URL, PROPERTY_AUTH_TOKEN,
	PROPERTY_USER
} from "../extras/variable_constants";

let http_request_service = (URL, method="POST", data={}) => {

	HEADERS["Authorization"] = `JWT ${localStorage.getItem(PROPERTY_AUTH_TOKEN)}`;

	let options = {
		method: method,
		headers: HEADERS
	};
	if (method.toUpperCase() !== "GET") {
		options["body"] = JSON.stringify(data);
	}

	return fetch(URL, options)
		.then(response => {
			//const regExp = /^2[0-9].*$/;

			if (response.status === 200 || response.status === 201) {
				return Promise.resolve(response);
			}else {
				return Promise.reject(response);
			}
		})
		.then(response => response.json()) // parse response as JSON
		.then(data => {
			// success
			if (URL === LOGOUT_URL) {
				localStorage.clear();
				return true;

			}else if (URL === LOGIN_URL) {
				if (data.hasOwnProperty(PROPERTY_AUTH_TOKEN)) {
					localStorage.setItem(PROPERTY_AUTH_TOKEN, data[PROPERTY_AUTH_TOKEN]);
				}
				if (data.hasOwnProperty(PROPERTY_USER)) {
					localStorage.setItem(PROPERTY_USER, JSON.stringify(data[PROPERTY_USER]));
				}
				return true;
			}
			return data;
		})
		.catch(function (error) {
			if (URL !== LOGIN_URL && error.status === 401){
				localStorage.clear();
				location.href = LOGIN_PATH;
			}
			return error;
		});
};

module.exports = {
	http_service: http_request_service,
};
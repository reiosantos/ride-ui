
import {HEADERS, LOGIN_URL, LOGOUT_URL, PROPERTY_AUTH_TOKEN, PROPERTY_USER} from "../extras/variable_constants";

let make_post_request_service = (URL, data={}) => {

	HEADERS["Authorization"] = `JWT ${localStorage.getItem(PROPERTY_AUTH_TOKEN)}`;

	return fetch(URL,
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
			if (URL === LOGIN_URL) {
				return error.json();
			}
			return error;
		});
};

let make_get_request_service = (URL) => {

	HEADERS["Authorization"] = `JWT ${localStorage.getItem(PROPERTY_AUTH_TOKEN)}`;

	return fetch(URL,
		{
			method: "GET",
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
			return data;
		})
		.catch(function (error) {
			return error;
		});
};

module.exports = {
	login_service: make_post_request_service,
	logout_service: make_post_request_service,
	signup_service: make_post_request_service,
	add_ride_service: make_post_request_service,
	fetch_all_rides_service: make_get_request_service,
};
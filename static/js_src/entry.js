import {
	DRIVER_PATH,
	LOGIN_PATH, PASSENGER_PATH, PROPERTY_AUTH_TOKEN, PROPERTY_USER, SIGNUP_PATH, USER_TYPE_DRIVER, USER_TYPE_PASSENGER,
	WELCOME_PATH
} from "./extras/variable_constants";

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

const login = require("./requires/login");
const logout = require("./requires/logout");
const signup = require("./requires/signup");
const rides = require("./requires/rides");
const requests = require("./requires/rides.requests");

// document event listeners definitions

const login_form = document.getElementById("form-sign-in");
const signup_form = document.getElementById("form-sign-up");
const logout_button = document.getElementById("logout");
const about_button = document.getElementById("about");
const new_offer_form = document.getElementById("form-add-new-offer");
const ride_offers_table = document.getElementById("rideOffers");
const ride_search_form = document.getElementById("form-search-offer");
const ride_search_field = document.getElementById("inputRideLocation");
const ride_requests_table = document.getElementById("rideRequests");
const ride_list = document.getElementById("rides_list");

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
if (new_offer_form){
	new_offer_form.addEventListener("submit", (form) => rides.add_ride(form));
}
if (ride_offers_table){
	rides.fetch_all_rides();
	setInterval(rides.fetch_all_rides, 30000);
}
if (ride_search_form) {
	ride_search_form.addEventListener("submit", (form) => {
		form.preventDefault();
		form  = form.target;
		const search = form.inputRideLocation.value;
		rides.search_rides(search);
	});
}
if (ride_search_field) {
	ride_search_field.addEventListener("keyup", (event) => {
		const search = event.target.value;
		rides.search_rides(search);
	});
}
if (ride_requests_table && ride_list){

	ride_list.addEventListener("change", (event) => {
		let val = event.target.value;
		if (val !== "0"){
			requests.fetch_all_ride_requests(val);
		}
	});
}
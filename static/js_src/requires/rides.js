import {formatDateTime, validateAmount, validateDate, validateTime} from "../extras/main";
import {ADD_AND_RETRIEVE_RIDES_URL} from "../extras/variable_constants";
import {add_ride_service} from "../services/commons.service";

let add_ride = (form) => {

	form.preventDefault();
	form = form.target;

	const destination = form.inputDestination;
	const trip_from = form.inputTripFrom;
	const cost = form.inputCost;
	const departure_time = form.inputDate;

	let error_panel = document.getElementById("loginError");
	let success_panel = document.getElementById("signupSuccess");
	let destination_error = document.getElementById("destinationError");
	let trip_from_error = document.getElementById("tripFromError");
	let cost_error = document.getElementById("costError");
	let depart_time_error = document.getElementById("departTimeError");

	destination_error.style.display = "none";
	trip_from_error.style.display = "none";
	cost_error.style.display = "none";
	depart_time_error.style.display = "none";
	error_panel.style.display = "none";
	success_panel.style.display = "none";

	let date_value;
	try {
		date_value = new Date(departure_time.value);
	} catch (exception) {
		alert(exception.message);
		return false;
	}
	let date_time = formatDateTime(date_value);
	let date_string = date_time.split(" ")[0];
	let time_string = date_time.split(" ")[1];

	if (validateAmount(cost.value) && cost.value > 0) {
		if (destination.value.trim().length > 2) {

			if (validateDate(date_string) && validateTime(time_string)) {
				if (trip_from.value.trim().length > 2) {

					const data = {
						depart_time: date_time,
						cost: cost.value,
						trip_from: trip_from.value,
						destination: destination.value
					};
					return handle_request(data, error_panel, success_panel);
				}
				trip_from_error.style.display = "block";
				return false;
			}
			depart_time_error.style.display = "block";
			return false;
		}
		destination_error.style.display = "block";
		return false;
	}
	cost_error.style.display = "block";
	return false;
};

let handle_request = async (data, error_panel, success_panel) => {

	let response = await add_ride_service(ADD_AND_RETRIEVE_RIDES_URL, data);

	if (response && response.hasOwnProperty("success_message")) {

		success_panel.innerHTML = response.success_message;
		success_panel.style.display = "block";
		error_panel.style.display = "none";

	} else if (response
		&& response.hasOwnProperty("error_message")
		&& response.hasOwnProperty("data")) {

		error_panel.innerHTML = `${response.error_message} <br> ${response.data ? response.data : ""}`;
		error_panel.style.display = "block";
	} else {
		error_panel.innerHTML = "Unknown error. consult the administrator";
		error_panel.style.display = "block";
	}
	return true;
};

module.exports = {
	add_ride: add_ride
};
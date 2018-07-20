import {formatDateTime, sformat, sort_rides, validateAmount, validateDate, validateTime} from "../extras/main";
import {ADD_AND_RETRIEVE_RIDES_URL} from "../extras/variable_constants";
import {http_service} from "../services/commons.service";
import {prepare_modal} from "./modal";

let all_rides_original = [];

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

	let response = await http_service(ADD_AND_RETRIEVE_RIDES_URL, "POST", data);

	if (response && response.hasOwnProperty("success_message")) {

		success_panel.innerHTML = response.success_message;
		success_panel.style.display = "block";
		error_panel.style.display = "none";
		fetch_all_rides();

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
};

let fetch_all_rides = async () => {

	let response = await http_service(ADD_AND_RETRIEVE_RIDES_URL, "GET");

	let options = `<option value='0'>--------------------------------------------</option>`;
	let temp_option = `<option value='{0}'>{1}</option>`;

	if (response
		&& response.hasOwnProperty("data")
		&& response.data !== false) {

		all_rides_original.length = 0;

		all_rides_original.push(...response.data);
		all_rides_original.sort(sort_rides);

		populate_rides(all_rides_original);

		let taken = 0;
		for (let ride of all_rides_original) {
			if (ride.hasOwnProperty("status")) {
				if (ride.status.trim().toLowerCase() !== "available") {
					taken += 1;
				}
			}
			options += sformat(temp_option, [ride.ride_id, `From ${ride.trip_from} - To 
			${ride.destination}	(${ride.post_date})`]);
		}
		document.getElementById("rides_given").innerText = all_rides_original.length;
		document.getElementById("rides_taken").innerText = taken;
		document.getElementById("rides_list").innerHTML = options;
	}
};

let search_rides = (term) => {

	const temp = [];
	for (let i = 0; i < all_rides_original.length; i++) {

		const ride = all_rides_original[i];

		if (ride.hasOwnProperty("destination")
			&& ride.destination.trim().toLocaleLowerCase().search(term.trim().toLowerCase()) >= 0
		) {
			temp.push(ride);
		}
	}
	populate_rides(temp);
};

let populate_rides = (data) => {

	let table_body = document.getElementById("rideOffers").querySelector("tbody");

	let fill_ride_data = (date, rows) => {

		return `<tr>
                    <td class="post_date">${new Date(date).toDateString()}</td>
                    <td colspan="3">
                        <table class="table bordered">
                        
                            <thead><tr><th>From</th><th>Destination</th><th>Status</th></tr></thead>
                            
                            <tbody>
                            
                            ${rows.map(ride_rows).join("")}
                            
                            </tbody>
                        </table>
                    </td>
                </tr>`;
	};

	let ride_rows = (row) => {

		let name = row.hasOwnProperty("trip_from") ? row.trip_from : "No source";
		let destination = row.hasOwnProperty("destination") ? row.destination : "No destination";
		let status = row.status;

		return `<tr class="more-details" data='${JSON.stringify(row)}'>
                                <td>${name}</td>
                                <td>${destination}</td>
                                <td class="${status}">${status.charAt(0).toUpperCase()}${status.slice(1)}</td>
                            </tr>`;
	};

	let rides = {};
	for (let ride of  data) {
		let date_key = ride.post_date.split(" ")[0];

		if (!rides.hasOwnProperty(date_key)) {
			rides[date_key] = [];
		}
		rides[date_key].push(ride);
	}
	table_body.innerHTML = "";
	const keys = Object.keys(rides);
	for (let key of keys) {
		table_body.innerHTML += fill_ride_data(key, rides[key]);
	}
	prepare_modal();
};

module.exports = {
	search_rides: search_rides,
	add_ride: add_ride,
	fetch_all_rides: fetch_all_rides,
};
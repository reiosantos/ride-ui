import {http_service} from "../services/commons.service";
import {ADD_AND_RETRIEVE_RIDES_URL, POST_FETCH_RIDE_REQUESTS_URL} from "../extras/variable_constants";
import {sformat, sort_rides} from "../extras/main";
import {prepare_modal} from "./modal";

let all_rides_original = [];

let fetch_all_passenger_rides = async () => {

	let response = await http_service(ADD_AND_RETRIEVE_RIDES_URL, "GET");

	if (response
		&& response.hasOwnProperty("data")
		&& response.data !== false) {

		all_rides_original.length = 0;

		all_rides_original.push(...response.data);
		all_rides_original.sort(sort_rides);

		populate_passenger_rides(all_rides_original);

		document.getElementById("total_rides").innerHTML = all_rides_original.length;
	}
};

let populate_passenger_rides = (data) => {

	let table_body = document.getElementById("rideOffers").querySelector("tbody");

	let fill_ride_data = (date, rows) => {

		return `<tr>
                    <td>
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

		if (row.status === "taken") {
			return "";
		}

		let temp_patch = `<td style="text-align: right;"><button class="accept request" ride_id="${row.ride_id}">send request</button></td>`;

		return `<tr class="more-details" data='${JSON.stringify(row)}'>
                                <td>${row.trip_from}</td>
                                <td>${row.destination}</td>
                                ${temp_patch}
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

	Array.from(document.getElementsByClassName("request")).forEach(function (element) {
		let data = element.getAttribute("ride_id");
		element.addEventListener("click", send_request.bind(null, data));
	});
	prepare_modal();
};

let send_request = async (ride_id) => {

	let error_panel = document.getElementById("loginError");
	let success_panel = document.getElementById("signupSuccess");

	error_panel.style.display = "none";
	success_panel.style.display = "none";

	let response = await http_service(sformat(POST_FETCH_RIDE_REQUESTS_URL, [ride_id]), "PUT");

	if (response && response.hasOwnProperty("success_message")) {

		success_panel.innerHTML = response.success_message;
		success_panel.style.display = "block";
		error_panel.style.display = "none";

	} else {
		response.json().then((response) => {
			if (response.hasOwnProperty("error_message")) {

				error_panel.innerHTML = `${response.error_message} <br> - ${response.data}`;
				error_panel.style.display = "block";

			} else {
				error_panel.innerHTML = "Unknown error. consult the administrator";
				error_panel.style.display = "block";
			}
		});
	}
};

module.exports = {
	fetch_all_passenger_rides: fetch_all_passenger_rides,
};
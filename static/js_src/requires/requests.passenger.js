import {http_service} from "../services/commons.service";
import {POST_FETCH_RIDE_REQUESTS_URL, PROPERTY_USER} from "../extras/constant.variables";
import {sformat} from "../extras/main.utils";
import {prepare_modal} from "./modal";

let fetch_all_ride_requests = async (ride_id) => {

    let loader = document.getElementById("gif_loader_table");

    if (loader) {
        loader.style.display = "block";
    }

	let response = await http_service(sformat(POST_FETCH_RIDE_REQUESTS_URL, [ride_id]), "GET");

    if (loader) {
        loader.style.display = "none";
    }

	let all_requests = [];

	if (response
		&& response.hasOwnProperty("data")
		&& response.data !== false) {

		all_requests.length = 0;

		if (Array.isArray(response.data)){
			all_requests.push(...response.data);
		}else{
			all_requests.push(response.data);
		}

		populate_requests(all_requests);
	} else {
		document.getElementById("rides_taken").innerText = 0;
		document.getElementById("rideRequests").querySelector("tbody").innerHTML =
			"<tr><td colspan='2'>You have not taken any ride to this route</td></tr>";
	}
};

let populate_requests = (data) => {

	const table_body = document.getElementById("rideRequests").querySelector("tbody");

	let fill_request_data = (date, rows) => {

		return `<tr>
					<td>${new Date(date).toDateString()}</td>
                    <td>
                        <table class="table bordered">
                        
                            <thead><tr><th>Destination</th><th>Ride Cost</th></tr></thead>
                            
                            <tbody>
                            
                            ${rows.map(request_row).join("")}
                            
                            </tbody>
                        </table>
                    </td>
                </tr>`;
	};

	let request_row = (row) => {
		return `<tr class="more-details" data='${JSON.stringify(row)}'>
                                <td>${row.destination}</td>
                                <td>${row.trip_cost} Ugx</td>
                            </tr>`;
	};

	let rides = {};
	const user = JSON.parse(localStorage.getItem(PROPERTY_USER));

	for (let ride of  data) {
		if (ride.request_status === "accepted" && ride.passenger_id === user.user_id) {

			let date_key = ride.request_date.split(" ")[0];
			if (!rides.hasOwnProperty(date_key)) {
				rides[date_key] = [];
			}
			rides[date_key].push(ride);
		}
	}

	if (Object.keys(rides).length === 0) {
		document.getElementById("rides_taken").innerText = 0;
		document.getElementById("rideRequests").querySelector("tbody").innerHTML =
			"<tr><td colspan='2'>You have not taken any ride to this route</td></tr>";
		return;
	}

	table_body.innerHTML = "";
	const keys = Object.keys(rides);
	for (let key of keys) {
		table_body.innerHTML += fill_request_data(key, rides[key]);
	}

	prepare_modal();
};

module.exports = {
	fetch_all_ride_requests: fetch_all_ride_requests,
};
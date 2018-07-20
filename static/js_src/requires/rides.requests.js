import {http_service} from "../services/commons.service";
import {POST_FETCH_RIDE_REQUESTS_URL, UPDATE_RIDE_REQUESTS_URL} from "../extras/variable_constants";
import {sformat} from "../extras/main";
import {prepare_modal} from "./modal";

let all_requests = [];

let fetch_all_ride_requests = async (ride_id) => {

	let error_panel = document.getElementById("loginError_1");
	let success_panel = document.getElementById("signupSuccess_1");

	error_panel.style.display = "none";
	success_panel.style.display = "none";

	let response = await http_service(sformat(POST_FETCH_RIDE_REQUESTS_URL, [ride_id]), "GET");

	if (response
		&& response.hasOwnProperty("data")
		&& response.data !== false) {

		all_requests.length = 0;

		all_requests.push(...response.data);
		document.getElementById("total_requests").innerText = all_requests.length;

		populate_requests(all_requests);
	} else {
		document.getElementById("rideRequests").querySelector("tbody").innerHTML = "";
	}
};

let populate_requests = (data) => {

	const table_body = document.getElementById("rideRequests").querySelector("tbody");

	let fill_request_data = (date, rows) => {

		return `<tr>
                    <td>
                        <table class="table bordered">
                        
                            <thead><tr><th>Pass. Names</th><th>Action</th></tr></thead>
                            
                            <tbody>
                            
                            ${rows.map(request_row).join("")}
                            
                            </tbody>
                        </table>
                    </td>
                </tr>`;
	};

	let request_row = (row) => {

		let name = row.hasOwnProperty("passenger_name") ? row.passenger_name : "------------------";
		let status = row.status;
		let request_status = row.request_status;

		let temp_patch = `<td style="text-align: right;">
<button class="reject change_request" data='{"status": "rejected", "request_id": "${row.request_id}", "ride_id": "${row.ride_id}"}'">Reject</button>
<button class="accept change_request" data='{"status": "accepted", "request_id": "${row.request_id}", "ride_id": "${row.ride_id}"}'>Accept</button></td>`;

		if (request_status === "accepted") {
			temp_patch = `<td style="text-align: right;">Request already accepted</td>`;

		} else if (request_status === "rejected") {
			temp_patch = `<td style="text-align: right;">Request was rejected 
<button class="accept change_request" data='{"status": "accepted", "request_id": "${row.request_id}", "ride_id": "${row.ride_id}"}'>Accept Request</button></td>`;
		}

		return `<tr class="more-details" data='${JSON.stringify(row)}'>
                                <td>${name}</td>
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
		table_body.innerHTML += fill_request_data(key, rides[key]);
	}

	Array.from(document.getElementsByClassName("change_request")).forEach(function (element) {
		let data = JSON.parse(element.getAttribute("data"));
		let status = data.status;
		let req_id = data.request_id;
		let rid_id = data.ride_id;
		element.addEventListener("click", change_request_status.bind(null, status, req_id, rid_id));
	});

	prepare_modal();
};

let change_request_status = async (status, request_id, ride_id) => {

	let error_panel = document.getElementById("loginError_1");
	let success_panel = document.getElementById("signupSuccess_1");

	error_panel.style.display = "none";
	success_panel.style.display = "none";

	let data = {
		status: status
	};
	let response = await http_service(sformat(UPDATE_RIDE_REQUESTS_URL, [ride_id, request_id]), "PUT", data);

	if (response && response.hasOwnProperty("success_message")) {

		success_panel.innerHTML = response.success_message;
		success_panel.style.display = "block";
		error_panel.style.display = "none";
		fetch_all_ride_requests(ride_id)

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
	fetch_all_ride_requests: fetch_all_ride_requests,
};
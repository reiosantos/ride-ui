import {fetch_all_ride_requests_service} from "../services/commons.service";
import {FETCH_RIDE_REQUESTS_URL} from "../extras/variable_constants";
import {sformat} from "../extras/main";
import {prepare_modal} from "./modal";

let all_requests = [];

let fetch_all_ride_requests = async (ride_id) => {

	let response = await fetch_all_ride_requests_service(sformat(FETCH_RIDE_REQUESTS_URL, [ride_id]));

	if (response
		&& response.hasOwnProperty("data")
		&& response.data !== false) {

		all_requests.length = 0;

		all_requests.push(...response.data);
		document.getElementById("total_requests").innerText = all_requests.length;

		populate_requests(all_requests);
	}else{
		document.getElementById("rideRequests").querySelector("tbody").innerHTML = "";
	}
};

let populate_requests = (data) => {

	const table_body = document.getElementById("rideRequests").querySelector("tbody");

	let fill_request_data = (date, rows) => {

		return `<tr>
                    <td class="post_date">${new Date(date).toDateString()}</td>
                    <td colspan="3">
                        <table class="table bordered">
                        
                            <thead><tr><th>Pass. Names</th><th>Action</th></tr></thead>
                            
                            <tbody>
                            
                            ${rows.map(request_rows).join("")}
                            
                            </tbody>
                        </table>
                    </td>
                </tr>`;
	};

	let request_rows = (row) => {

		let name = row.hasOwnProperty("passenger_name") ? row.passenger_name : "------------------";
		let status = row.status;
		let request_status = row.request_status;

		let temp_patch = `<td><button class="reject" onclick="change_request_status('rejected')">Reject</button>
<button class="accept" onclick="change_request_status('accepted')">Accept</button></td>`;

		if (request_status === "accepted") {
			temp_patch = "<td>Request already accepted</td>";

		} else if (request_status === "rejected"){
			temp_patch = `<td>Request was rejected <button class="accept" onclick="change_request_status('accepted')">
Accept</button></td>`;
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
		prepare_modal();
};

let change_request_status = (status) => {
	alert(status);
};

module.exports = {
	fetch_all_ride_requests: fetch_all_ride_requests,
};
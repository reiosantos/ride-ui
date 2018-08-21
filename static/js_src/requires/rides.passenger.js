import {http_service} from "../services/commons.service";
import {ADD_AND_RETRIEVE_RIDES_URL, POST_FETCH_RIDE_REQUESTS_URL} from "../extras/constant.variables";
import {sformat, sort_rides} from "../extras/main.utils";
import {prepare_modal} from "./modal";

let fetch_all_passenger_rides = async () => {

	let options = "<option value='0'>--------------------------------------------</option>";
	let temp_option = "<option value='{0}'>{1}</option>";

	let response = await http_service(ADD_AND_RETRIEVE_RIDES_URL, "GET");
	let all_rides_original = [];

	if (response
		&& response.hasOwnProperty("data")
		&& response.data !== false) {

		all_rides_original.length = 0;

		if (Array.isArray(response.data)){
			all_rides_original.push(...response.data);
		}else{
			all_rides_original.push(response.data);
		}
		all_rides_original.sort(sort_rides);

		for (let ride of all_rides_original) {
			options += sformat(temp_option, [ride.ride_id, `From ${ride.trip_from} - To 
			${ride.destination}	(${ride.post_date})`]);
		}
		document.getElementById("rides_list").innerHTML = options;

		populate_passenger_rides(all_rides_original);
	}
};

let populate_passenger_rides = (data) => {

    // let table_body = document.getElementById("rideOffers").querySelector("tbody");
    let ride_offers_divs = document.getElementById("rideOffersDivs");

	let fill_ride_data = (date, rows) => {

        return `<div style="width: auto; background: #fefefe; border-radius: 2px; padding: .3em; margin: .2em; float: none; border: 1px solid red">
                    Rides Offered on (${new Date(date).toDateString()})
                </div>
                <div class="grid">
                	${rows.map(ride_rows).join("")}
				</div>`;
	};

	let ride_rows = (row) => {

		if (row.status === "taken") {
			return "";
		}

        return `<div class="more-details z-depth-3" data='${JSON.stringify(row)}'><cite> To:${row.destination} <br> From:${row.trip_from}
                        <button class="accept request" ride_id="${row.ride_id}" >Send Request <i class="fa fa-send-o"></i></button>
                    </cite></div>`;
	};

	let rides = {};
	for (let ride of  data) {
		let date_key = ride.post_date.split(" ")[0];

		if (!rides.hasOwnProperty(date_key)) {
			rides[date_key] = [];
		}
		rides[date_key].push(ride);
	}
    ride_offers_divs.innerHTML = "";
	let count = 0;

	const keys = Object.keys(rides);
	for (let key of keys) {
        for (let ri of rides[key]) {
            if (ri.status !== "taken") {
                count++;
            }
        }
        ride_offers_divs.innerHTML += fill_ride_data(key, rides[key]);
    }
    document.getElementById("total_rides").innerHTML = count.toString();

	Array.from(document.getElementsByClassName("request")).forEach(function (element) {
		let data = element.getAttribute("ride_id");
		element.addEventListener("click", send_request.bind(null, data));
	});
	prepare_modal();
};

let send_request = async (ride_id) => {

	let error_panel = document.getElementById("loginError");
	let success_panel = document.getElementById("signupSuccess");

    let loader = document.getElementById("gif_loader_request");
    let buttons = document.getElementById("rideOffersDivs").querySelector("button");

	error_panel.style.display = "none";
	success_panel.style.display = "none";

    if (loader) {
        loader.style.display = "block";
        Array.from(buttons, (ele) => ele.style.display = "none")
    }

    let response = await http_service(sformat(POST_FETCH_RIDE_REQUESTS_URL, [ride_id]), "POST");

    if (loader) {
        loader.style.display = "none";
        Array.from(buttons, (ele) => ele.style.display = "block")
    }

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
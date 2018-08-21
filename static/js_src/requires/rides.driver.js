import {formatDateTime, sformat, sort_rides, validateAmount, validateDate, validateTime} from "../extras/main.utils";
import {ADD_AND_RETRIEVE_RIDES_URL, DELETE_RIDE_URL} from "../extras/constant.variables";
import {http_service} from "../services/commons.service";
import {prepare_modal} from "./modal";

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

    let loader = document.getElementById("gif_loader");
    let button = document.getElementById('btnAddOffer');

    if (loader) {
        loader.style.display = "block";
        button.style.display = 'none';
    }

    let response = await http_service(ADD_AND_RETRIEVE_RIDES_URL, "POST", data);

    if (loader) {
        loader.style.display = "none";
        button.style.display = 'block';
    }

    if (response && response.hasOwnProperty("success_message")) {

        success_panel.innerHTML = response.success_message;
        success_panel.style.display = "block";
        error_panel.style.display = "none";
        fetch_all_rides().then(() => {
        });

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

let all_rides_original = [];

let fetch_all_rides = async () => {

    let response = await http_service(ADD_AND_RETRIEVE_RIDES_URL, "GET");

    let options = "<option value='0'>--------------------------------------------</option>";
    let temp_option = "<option value='{0}'>{1}</option>";

    if (response
        && response.hasOwnProperty("data")
        && response.data !== false) {

        all_rides_original.length = 0;

        if (Array.isArray(response.data)) {
            all_rides_original.push(...response.data);
        } else {
            all_rides_original.push(response.data);
        }
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

        let destination = row.hasOwnProperty("destination") ? row.destination : "No destination";
        let status = row.status;

        return `<div class="more-details z-depth-3" data='${JSON.stringify(row)}'><cite> To:${destination} <em class="${status}">:${status.charAt(0).toUpperCase()}${status.slice(1)}</em>
                        <button class="delete_ride" data="${row.ride_id}" style="color: red; bottom: 2px;">Delete  <i class="fa fa-trash-o"></i></button>
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

    const keys = Object.keys(rides);
    for (let key of keys) {
        ride_offers_divs.innerHTML += fill_ride_data(key, rides[key]);
    }

    Array.from(document.getElementsByClassName("delete_ride")).forEach(function (element) {
        let ride_id = element.getAttribute("data");
        element.addEventListener("click", delete_ride.bind(null, ride_id));
    });

    prepare_modal();
};

let delete_ride = async (ride_id) => {

    if (!confirm("Are you sure you want to delete this ride?")) {
        return false;
    }

    let loader = document.getElementById("gif_loader_delete");
    let buttons = document.getElementById("rideOffersDivs").querySelector("button");

    let error_panel = document.getElementById("loginError_2");
    let success_panel = document.getElementById("signupSuccess_2");

    error_panel.style.display = "none";
    success_panel.style.display = "none";

    let data = {
        status: status
    };

    if (loader) {
        loader.style.display = "block";
        Array.from(buttons, (ele) => ele.style.display = "none")
    }

    let response = await http_service(sformat(DELETE_RIDE_URL, [ride_id]), "DELETE", data);

    if (loader) {
        loader.style.display = "none";
        Array.from(buttons, (ele) => ele.style.display = "block");
    }

    if (response && response.hasOwnProperty("success_message")) {

        success_panel.innerHTML = response.success_message;
        success_panel.style.display = "block";
        error_panel.style.display = "none";
        fetch_all_rides().then(() => {
        });

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
    search_rides: search_rides,
    add_ride: add_ride,
    fetch_all_rides: fetch_all_rides,
};
// Get the button that opens the modal

let prepare_modal = () => {
	const rows = document.getElementsByClassName("more-details");

	// Get the modal
	const modal = document.getElementById("myModal");

	// When the user clicks the button, open the modal
	const on_row_click = function (event) {
		let data = event.target.parentNode.getAttribute("data");
		if (data) {
			data = JSON.parse(data);

			modal.querySelector("#modal-ride-id").innerText = data.hasOwnProperty("ride_id") ? data.ride_id : "";
			modal.querySelector("#modal-passenger-name").innerText = data.hasOwnProperty("passenger_name") ? data.passenger_name : "";
			modal.querySelector("#modal-trip-status").innerText = data.hasOwnProperty("status") ? data.status : "";
			modal.querySelector("#modal-destination").innerText = data.hasOwnProperty("destination") ? data.destination : "No destination";
			modal.querySelector("#modal-trip-from").innerText = data.hasOwnProperty("trip_from") ? data.trip_from : "";
			modal.querySelector("#modal-trip-cost").innerText = (data.hasOwnProperty("cost") ? data.cost : 0) + " Ugx";
			modal.querySelector("#modal-post-date").innerText = data.hasOwnProperty("post_date") ? new Date(data.post_date) : "";
			modal.querySelector("#modal-depart-date").innerText = data.hasOwnProperty("departure_time") ? new Date(data.departure_time) : "";
			modal.querySelector("#modal-passenger-contact").innerText = data.hasOwnProperty("contact") ? data.contact : "";

			modal.style.display = "block";
		}
	};

	Array.from(rows).forEach(function (element) {
		element.addEventListener("click", on_row_click);
	});

	// Get the <span> element that closes the modal
	let span = document.getElementsByClassName("close");

	// When the user clicks on <span> (x), close the modal
	if (span && span.length > 0) {
		span = span[0];
		span.onclick = function () {
			modal.style.display = "none";
		};
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	};
};

export {prepare_modal};

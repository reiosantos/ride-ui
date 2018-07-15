// Get the button that opens the modal

const rows = document.getElementsByClassName("more-details");

// Get the modal
const modal = document.getElementById("myModal");

// When the user clicks the button, open the modal
const on_row_click = function (event) {
	const data = event.target.parentNode.getAttribute("data");
	if (data) {
		alert(data);
	}
	modal.querySelector("#modal-name").innerText = "Santos";
	modal.querySelector("#modal-status").innerText = "Available";
	modal.querySelector("#modal-tripto").innerText = "Namasuba";
	modal.querySelector("#modal-cost").innerText = "4000";
	modal.querySelector("#modal-date").innerText = "2018-06-24";
	modal.querySelector("#modal-contact").innerText = "0377888999";
	modal.style.display = "block";
};

Array.from(rows).forEach(function (element) {
	element.addEventListener("click", on_row_click);
});

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close");

// When the user clicks on <span> (x), close the modal
if(span && span.length > 0){
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

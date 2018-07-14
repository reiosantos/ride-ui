
function validateContact(phone) {
	const re = /\(?\d{3}\)?([-\s.])?\d{3}\1?\d{4}/;
	return re.test(phone.toLowerCase());
}

function validateAmount(cost) {
	let re = /^[.0-9]+$/;
	return re.test(cost);
}

function validatePassword(password) {
	const re = /^[\S\s]{6,}$/;
	return re.test(password.toLowerCase());
}

function saveRide(form) {
	const location = form.inputLocation;
	const amount = form.inputCost;

	document.getElementById("locationError").style.display = "none";
	document.getElementById("costError").style.display = "none";

	if (form.id === "form-new-offer") {

		if (location.value.length > 3) {
			if (validateAmount(amount.value)) {
				return true;
			}
			document.getElementById("costError").style.display = "block";
			return false;
		}
		document.getElementById("locationError").style.display = "block";
		return false;
	}
	return false;
}

function searchRide(event) {
	console.log(event);
}
export let exports = {};

export {validateContact, validatePassword, validateAmount, saveRide, searchRide};

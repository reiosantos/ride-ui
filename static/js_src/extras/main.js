
let validateContact = (phone) => {
	const re = /\(?\d{3}\)?([-\s.])?\d{3}\1?\d{4}/;
	return re.test(phone.toLowerCase());
};

let validateAmount = (cost) => {
	let re = /^[.0-9]+$/;
	return re.test(cost);
};

let validatePassword = (password) => {
	const re = /^[\S\s]{6,}$/;
	return re.test(password.toLowerCase());
};

let validateDate = (date) => {
	const date_re = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

	if (date.trim() !== "") {
		let regs  = date.match(date_re);
		let today = new Date();

		if (regs) {
			regs[1] = parseInt(regs[1]);
			regs[2] = parseInt(regs[2]);
			regs[3] = parseInt(regs[3]);

			// year value from 2018
			if (regs[1] < today.getFullYear()) {
				alert(`Invalid value for year: ${regs[1]} - must not be less than ${today.getFullYear()}`);
				return false;
			}
			// month value between 1 and 12
			if (regs[2] < 1 || regs[2] > 12) {
				alert(`Invalid value for month: ${regs[2]} - must be from 1 to 12 `);
				return false;
			}
			// month value if less than this month in this year
			if (regs[1] === today.getFullYear() && regs[2] < (today.getMonth() + 1)) {
				alert(`Provide a month not less than this month: you provided - ${regs[2]}`);
				return false;
			}
			// day value between 1 and 31
			if (regs[3] < 1 || regs[3] > 31) {
				alert(`Invalid value for day: ${regs[3]} - must be from 1 to 31`);
				return false;
			}
			// month value if less than this month in this year
			if (regs[1] === today.getFullYear() && regs[2] === (today.getMonth() + 1) && regs[3] < today.getDate()) {
				alert(`Provide a date not less than toady: you provided - ${regs[3]}`);
				return false;
			}
			return true;
		} else {
			alert("Invalid date format: " + date);
		}
	}
	return false;
};

let validateTime = (time) => {
	// regular expression to match required time format
	const time_re = /^(\d{1,2}):(\d{2})(:\d{2})?([ap]m)?$/;

	if(time.trim() !== "") {
		let regs  = time.match(time_re);

		if(regs) {
			regs[1] = parseInt(regs[1]);
			regs[2] = parseInt(regs[2]);

			if(regs[3]) {
				regs[3] = parseInt(regs[3]);

				// 12-hour value between 1 and 12
				if(regs[1] < 1 || regs[1] > 12) {
					alert("Invalid value for hours: " + regs[1]);
					return false;
				}
			} else {
				// 24-hour value between 0 and 23
				if(regs[1] > 23) {
					alert("Invalid value for hours: " + regs[1]);
					return false;
				}
			}
			// minute value between 0 and 59
			if(regs[2] > 59) {
				alert("Invalid value for minutes: " + regs[2]);
				return false;
			}
			return true;
		} else {
			alert("Invalid time format: " + time);
		}
	}
	return false;
};

let formatDateTime = (date) => {
	
	return (date.getFullYear().toString() + "-" +
				((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)).toString() + "-" +
				(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()).toString() + " " +
				(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()).toString() + ":" +
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()).toString() + ":" +
				(date.getSeconds() < 10 ? "0" + date.getSeconds() :  date.getSeconds()).toString());

};

let sformat = (source, params) => {
	for (let i in params) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), params[i]);
	}
	return source;
};

export let exports = {};

export {validateContact, validatePassword, validateAmount, validateTime, validateDate, formatDateTime, sformat};

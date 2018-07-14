
let constants = require("./variable_constants");
let main = require("./main");
let modal = require("./modal");
const login = require("./login");
const signup = require("./signup");
const login_service = require("./services/login.service");

// document event listeners definitions

document.getElementById("form-sign-in").addEventListener("submit", (form) => login.login(form));


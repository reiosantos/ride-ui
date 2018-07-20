
export const HEADERS = {
	"Accept": "application/json",
	"Content-type":"application/json"
};
export const LOGIN_PATH = "/templates/login.html";
export const SIGNUP_PATH = "/templates/signup.html";
export const WELCOME_PATH = "/index.html";
export const PASSENGER_PATH = "/templates/passenger/index.html";
export const DRIVER_PATH = "/templates/driver/index.html";

export const BASE_URL = "http://localhost:5000/api/v1";

export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const LOGOUT_URL = `${BASE_URL}/auth/logout`;
export const SIGNUP_URL = `${BASE_URL}/auth/signup`;
export const ADD_AND_RETRIEVE_RIDES_URL = `${BASE_URL}/rides`;
export const POST_FETCH_RIDE_REQUESTS_URL = `${BASE_URL}/rides/{0}/requests`;
export const UPDATE_RIDE_REQUESTS_URL = `${BASE_URL}/rides/{0}/requests/{1}`;

export const PROPERTY_AUTH_TOKEN = "auth_token";
export const PROPERTY_USER = "user";
export const USER_TYPE_DRIVER = "driver";
export const USER_TYPE_PASSENGER = "passenger";

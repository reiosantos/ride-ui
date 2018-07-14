
export const HEADERS = {
	"Accept": "application/json",
	"Content-type":"application/json"
};
export const BASE_URL = "http://localhost:5000/api/v1";

export const LOGIN_URL = `${BASE_URL}/auth/login`;

export const PROPERTY_AUTH_TOKEN = "auth_token";
export const PROPERTY_USER = "user";
export const PROPERTY_USER_TYPE = "user_type";
export const USER_TYPE_DRIVER = "driver";
export const USER_TYPE_PASSENGER = "passenger";

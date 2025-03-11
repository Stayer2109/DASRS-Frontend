/** @format */

import axios from "axios";

const config = {
	baseURL: import.meta.env.BE_BASE_URL,
	header: {
		"Content-Type": "application/json",
	},
};

const AuthAPI = axios.create(config);

export default AuthAPI;

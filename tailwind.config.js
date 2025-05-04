/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			spacing: {
				"standard-x": "12px",
				"standard-y": "8px",
			},
		},
	},
	plugins: [],
};

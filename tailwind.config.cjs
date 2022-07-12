const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Roboto Condensed', ...defaultTheme.fontFamily.sans],
				mono: ['Ubuntu Mono', ...defaultTheme.fontFamily.mono]
			}
		}
	},

	plugins: []
};

module.exports = config;

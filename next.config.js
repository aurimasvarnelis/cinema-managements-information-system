/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

const path = require("path");

module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
		prependData: `
    $light-shade: #f6f6f6;
    $light-accent: #C293B5;
    $main-brand-color: #7F53D2;
    $dark-accent: #8F6D96;
    $dark-shade: #4C475E;

    $textColorDark: #111011;
    $textColorLight: #e7d4e4;
  `,
	},
	env: {
		url: "http://localhost:3000",
		//url: "https://cinema-managements-information-system.vercel.app/",
	},
	nextConfig,
};

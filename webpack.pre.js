const { merge } = require("webpack-merge");
const prodConfig = require("./webpack.prod.js");
const publicPath = process.env.PUBLIC_PATH || "/app/themes/eefocus/dist/";

module.exports = () => {
	return new Promise(async (resolve, reject) => {
		let prod = await prodConfig();
		const config = merge(prod, {
			mode: "production",
			devtool: "source-map",
			output: {
				publicPath: publicPath,
			}
		});

		resolve(config);
	});
};

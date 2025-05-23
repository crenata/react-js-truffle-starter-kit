const webpack = require("webpack");

module.exports = function override(config) {
	const fallback = config.resolve.fallback || {};
	Object.assign(fallback, {
		"assert": require.resolve("assert"),
		"crypto": require.resolve("crypto-browserify"),
		"http": require.resolve("stream-http"),
		"https": require.resolve("https-browserify"),
		"os": require.resolve("os-browserify"),
		"path": require.resolve("path-browserify"),
		"stream": require.resolve("stream-browserify"),
		"vm": require.resolve("vm-browserify"),
		"url": require.resolve("url")
	});
	config.resolve.fallback = fallback;
	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"]
		})
	]);
	config.ignoreWarnings = [/Failed to parse source map/];
	return config;
};
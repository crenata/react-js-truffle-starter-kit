const workboxBuild = require("workbox-build");

const buildSW = () => {
	return workboxBuild.generateSW({
		globDirectory: "build",
		globPatterns: ["**/*.{css,js}", "index.html"],
		swDest: "build/sw.js",
		runtimeCaching: [{
			urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
			handler: "CacheFirst",
			options: {
				cacheName: "images",
				expiration: {
					maxAgeSeconds: 60 * 60 * 24 * 365,
					// maxEntries: 100
				}
			}
		}]
	});
};

buildSW();
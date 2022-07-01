const isLocalhost = Boolean(
	window.location.hostname === "localhost" ||
	window.location.hostname === "[::1]" ||
	window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?)){3}$/)
);

const registerValidSW = (swUrl, config) => {
	navigator.serviceWorker.register(swUrl).then((registration) => {
		registration.onupdatefound = () => {
			const installingWorker = registration.installing;
			if (installingWorker === null) {
				return;
			}
			installingWorker.onstatechange = () => {
				if (installingWorker.state === "installed") {
					if (navigator.serviceWorker.controller) {
						if (config && config.onUpdate) {
							config.onUpdate(registration);
						}
					} else {
						if (config && config.onSuccess) {
							config.onSuccess(registration);
						}
					}
				}
			};
		};
	}).catch((error) => {
		console.error("Error during service worker registration :", error);
	}).finally(() => {
		//
	});
};

const checkValidServiceWorker = (swUrl, config) => {
	fetch(swUrl, {
		headers: {
			"Service-Worker": "script"
		}
	}).then((response) => {
		const contentType = response.headers.get("content-type");
		if (
			response.status === 404 ||
			(
				contentType !== null &&
				contentType.indexOf("javascript") === -1
			)
		) {
			navigator.serviceWorker.ready.then((registration) => {
				registration.unregister().then(() => {
					window.location.reload();
				}).catch((error) => {
					console.error(error);
				}).finally(() => {
					//
				});
			}).catch((error) => {
				console.error(error);
			}).finally(() => {
				//
			});
		} else {
			registerValidSW(swUrl, config);
		}
	}).catch((error) => {
		console.error("No internet connection :", error);
	}).finally(() => {
		//
	});
};

export const register = (config) => {
	if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
		if (publicUrl.origin !== window.location.origin) {
			return;
		}
		window.addEventListener("load", () => {
			const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
			if (isLocalhost) {
				checkValidServiceWorker(swUrl, config);
				navigator.serviceWorker.ready.then(() => {
					//
				}).catch((error) => {
					console.error(error);
				}).finally(() => {
					//
				});
			} else {
				registerValidSW(swUrl, config);
			}
		});
	}
};

export const unregister = () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready.then((registration) => {
			registration.unregister().then(() => {
				//
			}).catch((error) => {
				console.error(error);
			}).finally(() => {
				//
			});
		}).catch((error) => {
			console.error(error);
		}).finally(() => {
			//
		});
	}
};
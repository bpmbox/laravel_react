const urlParamsRegexp = /[?&]([^=#]+)=([^&#]*)/g;

export const getURLQueryParams = (url) => {
	if (!url) {
		return null;
	}
	var params = {};
	var match = urlParamsRegexp.exec(url)
    while (match) {
		params[match[1]] = match[2];
		match = urlParamsRegexp.exec(url)
	}
	return params;
}

export const getURLScheme = (url) => {
	if (typeof url !== 'string') {
		return null;
	}
	return url.split('://')[0];
}

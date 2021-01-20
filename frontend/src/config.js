const config = {
	apiOrigin: (process.env.NODE_ENV === 'production')?
		window.location.origin
		:
		'http://127.0.0.1:5000'
}

export default config
import { request } from "./lib"

/**
 * @type {{
 * 	apiOrigin: string;
 * 	appConfig: () => Promise<{
 * 		time_resolition: number;
 * 		available_resources: number;
 * 	}>
 * }}
 */
const config = {
	apiOrigin: (process.env.NODE_ENV === 'production')?
		window.location.origin
		:
		'http://127.0.0.1:5000',
	async appConfig() {
		let data = await request('/api/config')
		.get()
		.send()

		return data.body.payload
	}
}

export default config
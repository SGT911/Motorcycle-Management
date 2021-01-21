import config from '../config'

export const storage = {
	/**
	 * @type {Storage}
	 */
	driver: localStorage,
	/**
	 * @param {string} key
	 * @returns {any | null}
	 */
	get(key) {
		let result = this.driver.getItem(key)
		if (result === null) {
			return null
		}

		return JSON.parse(result)
	},
	/**
	 * @param {string} key
	 * @param {any} value
	 * @returns {void}
	 */
	set(key, value) {
		if (value === null) return this.delete(key)

		this.driver.setItem(key, JSON.stringify(value))
	},
	/**
	 * @param {string} key
	 * @returns {boolean}
	 */
	exist(key) {
		return this.get(key) !== null
	},
	/**
	 * @param {string} key
	 * @returns {boolean}
	 */
	delete(key) {
		if (!this.exist(key)) return false

		this.driver.removeItem(key)
		return true
	}
}

/**
 * @param {number} length
 * @param {number} start
 * @param {number} step
 * @returns {Array<number>}
 */
export function range(length, start = 0, step = 1) {
	const arr = new Array()
	arr.push(start)
	let before = start
	for (let i = 0; i < length - 1; i++) {
		before += step
		arr.push(before)
	}

	return arr
}

/**
 * @param {string} url 
 * @returns {APIRequest}
 */
export function request(url) {
	return new APIRequest(
		`${config.apiOrigin}${url}`,
		'application/json',
		JSON.stringify
	)
}

class APIRequest {
	/**
	 * @param {string} url 
	 * @param {string} contentType 
	 * @param {(value: any) => string} parser 
	 */
	constructor(url, contentType, parser) {
		this.url = url
		this.headers = new Headers()
		this.method = 'GET'
		this.contentType = contentType
		this.parser = parser
		this.body = null
	}

	/**
	 * @param {{[key: string]: string}} headers 
	 * @returns {APIRequest}
	 */
	headers(headers) {
		for (const key in headers) {
			if (Object.hasOwnProperty.call(headers, key)) {
				const value = headers[key];
				this.headers.append(key, value)
			}
		}

		return this
	}

	/**
	 * @param {any} data 
	 * @returns {APIRequest}
	 */
	addBody(data) {
		this.body = data
		this.headers.append('Content-Type', this.contentType)
		return this
	}

	/**
	 * @param {'GET' | 'POST' | 'PUT' | 'OPTIONS' | 'DELTE'} method 
	 * @returns {APIRequest}
	 */
	changeMethod(method) {
		method = method.toUpperCase()
		if (['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'].includes(method)) {
			this.method = method
		} else {
			this.method = 'GET'
		}

		return this
	}

	/**
	 * @returns {APIRequest}
	 */
	get() {
		return this.changeMethod('GET')
	}

	/**
	 * @returns {APIRequest}
	 */
	post() {
		return this.changeMethod('POST')
	}

	/**
	 * @returns {APIRequest}
	 */
	put() {
		return this.changeMethod('PUT')
	}

	/**
	 * @returns {APIRequest}
	 */
	options() {
		return this.changeMethod('OPTIONS')
	}

	/**
	 * @returns {APIRequest}
	 */
	delete() {
		return this.changeMethod('DELETE')
	}

	/**
	 * @returns {Promise<{
	 * 	body: any | string;
	 *  status: number;
	 * 	headers: Headers;
	 * }>}
	 */
	async send() {
		const req = await fetch(this.url, {
			method: this.method,
			mode: 'cors',
			headers: this.headers,
			body: (this.body === null)? undefined : this.parser(this.body)
		})

		let body

		if (req.headers.get('Content-Type') === 'application/json') {
			body = await req.json()
		} else {
			body = await req.text()
		}

		return {
			body,
			status: req.status,
			headers: req.headers
		}
	}
}
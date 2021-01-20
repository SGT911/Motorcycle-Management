import config from '../config'

export const storage = {
	driver: localStorage,
	get(key) {
		let result = this.driver.getItem(key)
		if (result === null) {
			return null
		}

		return JSON.parse(result)
	},
	set(key, value) {
		if (value === null) return this.delete(key)

		this.driver.setItem(key, JSON.stringify(value))
	},
	exist(key) {
		return this.get(key) !== null
	},
	delete(key) {
		if (!this.exist(key)) return false

		this.driver.removeItem(key)
		return true
	}
}

export function request(url) {
	return new APIRequest(
		`${config.apiOrigin}${url}`,
		'application/json',
		JSON.stringify
	)
}

class APIRequest {
	constructor(url, contentType, parser) {
		this.url = url
		this.headers = new Headers()
		this.method = 'GET'
		this.contentType = contentType
		this.parser = parser
		this.body = null
	}

	headers(headers) {
		for (const key in headers) {
			if (Object.hasOwnProperty.call(headers, key)) {
				const value = headers[key];
				this.headers.append(key, value)
			}
		}

		return this
	}

	addBody(data) {
		this.body = data
		this.headers.append('Content-Type', this.contentType)
		return this
	}

	changeMethod(method) {
		method = method.toUpperCase()
		if (['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'].includes(method)) {
			this.method = method
		} else {
			this.method = 'GET'
		}

		return this
	}

	get() {
		return this.changeMethod('GET')
	}

	post() {
		return this.changeMethod('POST')
	}

	put() {
		return this.changeMethod('PUT')
	}

	options() {
		return this.changeMethod('OPTIONS')
	}

	delete() {
		return this.changeMethod('DELETE')
	}

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
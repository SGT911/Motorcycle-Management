/**
 * @param {Date} date 
 * @returns {string}
 */
export function toDateString(date) {
	let year = date.getFullYear().toString()
	let month = date.getMonth() + 1
	let day = date.getDate()

	month = (month < 10)? `0${month}` : month.toString()
	day = (day < 10)? `0${day}` : day.toString()

	return `${year}-${month}-${day}`
}

/**
 * @param {Date} date 
 * @returns {string}
 */
export function toTimeString(date) {
	let hour = date.getHours()
	let minutes = date.getMinutes()

	hour = (hour < 10)? `0${hour}` : hour.toString()
	minutes = (minutes < 10)? `0${minutes}` : minutes.toString()

	return `${hour}:${minutes}`
}

/**
 * @returns {Date}
 */
export function today() {
	let date = new Date()
	date.setHours(0)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)

	return date
}
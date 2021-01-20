import { Redirect } from 'react-router-dom'
import { storage } from '../lib'

export const isLoggedIn = () => storage.exist('user')

export const MustBeLoggedIn = () => {
	if (!isLoggedIn()) {
		return <Redirect to="/login" />
	}

	return null
}

export const OnlyWithOutUser = () => {
	if (isLoggedIn()) {
		return <Redirect to="/" />
	}

	return null
}
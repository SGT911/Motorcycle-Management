import { Redirect } from 'react-router-dom'
import { storage } from '../../lib'

const Logout = () => {
	storage.delete('user')

	return <Redirect to="/" />
}

export default Logout
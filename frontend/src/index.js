import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Switch,
	Route
} from 'react-router-dom'

import App from './components/pages/App'
import Login from './components/pages/Login'
import Logout from './components/pages/Logout'
import Register from './components/pages/Register'
import ChangePassword from './components/pages/ChangePassword'

import * as Middlewares from './middlewares'

import './theme'

const appEl = document.getElementById('root')

ReactDOM.render(
	<Router hashType="noslash">
		<Switch>
			<Route path="/logout">
				<Logout />
			</Route>
			<Route path="/login">
				<Middlewares.OnlyWithOutUser />
				<Login />
			</Route>
			<Route path="/register">
				<Middlewares.OnlyWithOutUser />
				<Register />
			</Route>
			<Route path="/changePassword">
				<Middlewares.MustBeLoggedIn />
				<ChangePassword />
			</Route>
			<Route path="/">
				<Middlewares.MustBeLoggedIn />
				<App />
			</Route>
		</Switch>
	</Router>,
	appEl
)

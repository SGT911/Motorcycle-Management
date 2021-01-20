import React from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Switch,
	Route
} from 'react-router-dom'

import App from './components/pages/App'
import Test from './components/pages/Test'
import Login from './components/pages/Login'
import Register from './components/pages/Register'

import * as Middlewares from './middlewares'

import './theme'

const appEl = document.getElementById('root')

ReactDOM.render(
	<React.StrictMode>
		<Router hashType="noslash">
			<Switch>
				<Route path="/test">
					<Middlewares.MustBeLoggedIn />
					<Test />
				</Route>
				<Route path="/login">
					<Middlewares.OnlyWithOutUser />
					<Login />
				</Route>
				<Route path="/register">
					<Middlewares.OnlyWithOutUser />
					<Register />
				</Route>
				<Route path="/">
					<Middlewares.MustBeLoggedIn />
					<App />
				</Route>
			</Switch>
		</Router>
	</React.StrictMode>,
	appEl
)

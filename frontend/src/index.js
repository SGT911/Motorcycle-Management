import React from 'react'
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Switch,
	Route
} from 'react-router-dom'

import 'antd/dist/antd.min.css'

import App from './components/pages/App'
import Test from './components/pages/Test'

const appEl = document.getElementById('root')

ReactDOM.render(
	<React.StrictMode>
		<Router hashType="noslash">
			<Switch>
				<Route path="/test">
					<Test />
				</Route>
				<Route path="/">
					<App />
				</Route>
			</Switch>
		</Router>
	</React.StrictMode>,
	appEl
)

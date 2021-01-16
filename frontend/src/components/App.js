import { Link } from 'react-router-dom'

import logo from '../assets/logo.svg'
import './styles/App.css'

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code className="App-code">src/App.js</code> and save to reload.
				</p>
				<Link
					className="App-link"
					to="/test"
				>
					Learn React
				</Link>
			</header>
		</div>
	)
}

export default App;

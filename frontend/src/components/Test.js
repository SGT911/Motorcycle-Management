import { useState } from 'react'
import { Link } from 'react-router-dom'

import './styles/App.css'

function Test() {
	const [counter, setState] = useState(0)

	const add = () => setState(counter + 1)
	const substract = () => setState(counter - 1)
	const reset = () => setState(0)

	return (
		<div className="App App-header">
			<p>{ counter }</p>
			<div className="Global-inline">
				<button
					className="App-button is-Red"
					onClick={substract}
				> - Substract </button>
				<button
					className="App-button is-Green"
					onClick={add}
				> + Add </button>
				<button
					className="App-button"
					onClick={reset}
				> Reset </button>
			</div>
			<hr className="App-line" />
			<Link className="App-link" to="/">To Home</Link>
		</div>
	)
}
	
export default Test;
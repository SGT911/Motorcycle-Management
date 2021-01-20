import React from 'react'
import { NavBar } from '../NavBar'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Typography } from 'antd'

import logo from '../../assets/logo.svg'

const App = () => {
	return (
		<React.Fragment>
			<NavBar path="/" />
			<Container span={10}>
				<Typography>
					<img src={logo} className="App-logo" alt="logo" />
					<Typography.Paragraph>
						Edit <Typography.Text code={true}>src/App.js</Typography.Text> and save to reload.
					</Typography.Paragraph>
					<ButtonLink to="/test">
						Learn React
					</ButtonLink>
				</Typography>
			</Container>
		</React.Fragment>
	)
}

export default App;

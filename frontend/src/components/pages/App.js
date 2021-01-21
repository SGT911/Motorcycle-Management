import React, { useEffect, useState } from 'react'
import { NavBar } from '../NavBar'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { LoadPoints } from '../LoadPoints'
import { Typography } from 'antd'

import logo from '../../assets/logo.svg'
import config from '../../config'

const App = () => {
	const [state, setState] = useState({
		loaded: false,
		timeResolution: null,
		availableResources: null
	})

	useEffect(() => {
		const asyncFunc = async () => {
			let appConfig = await config.appConfig()
			
			setState({
				...state,
				loaded: true,
				timeResolution: appConfig.time_resolution,
				availableResources: appConfig.available_resources
			})
		}

		if (!state.loaded) {
			asyncFunc()
		}
	})

	return (
		<React.Fragment>
			<NavBar path="/" />
			<Container span={10}>
				{
					(state.loaded)?
						<Typography>
							<img src={logo} className="App-logo" alt="logo" />
							<Typography.Paragraph>
								Edit <Typography.Text code={true}>src/App.js</Typography.Text> and save to reload.
							</Typography.Paragraph>
							<ButtonLink to="/test">
								Learn React
							</ButtonLink>
						</Typography>
					:
						<Typography>
							<Typography.Title style={{textAlign: 'center'}}>
								Loading<LoadPoints count={5} />
							</Typography.Title>
						</Typography>
				}
			</Container>
		</React.Fragment>
	)
}

export default App
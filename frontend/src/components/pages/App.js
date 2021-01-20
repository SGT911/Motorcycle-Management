import ButtonLink from '../ButtonLink'
import Container from '../Container'

import { Typography } from 'antd'

import logo from '../../assets/logo.svg'

const App = () => {
	return (
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
	)
}

export default App;

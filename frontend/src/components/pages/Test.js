import React, { useState } from 'react'
import { buttonStyles } from '../../styles'

import { NavBar } from '../NavBar'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'

import { Button } from 'antd'
import { Divider, Typography } from 'antd'

const Test = () => {
	const [counter, setState] = useState(0)

	const add = () => setState(counter + 1)
	const substract = () => setState(counter - 1)
	const reset = () => setState(0)

	return (
		<React.Fragment>
			<NavBar path="/test" />
			<Container span={12}>
				<Typography.Paragraph style={{textAlign: 'center'}}>
					{ counter }
				</Typography.Paragraph>
				<Button
					style={buttonStyles}
					danger={true}
					onClick={substract}
				> - Substract </Button>
				<Button
					style={buttonStyles}
					type="primary"
					onClick={add}
				> + Add </Button>
				<Button
					style={buttonStyles}
					type="default"
					onClick={reset}
				> Reset </Button>
				<Divider />
				<ButtonLink to="/">To Home</ButtonLink>
			</Container>
		</React.Fragment>
	)
}
	
export default Test;
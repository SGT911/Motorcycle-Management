import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { formStyle, buttonStyles } from '../../styles'

import { Container } from '../Container'
import { ButtonLink } from '../ButtonLink'
import { Form, Input, Checkbox, Button } from 'antd'
import { notification } from 'antd'

import { UserOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { request, storage } from '../../lib'

const Login = () => {
	const history = useHistory()
	const [state, setState] = useState({
		user: null,
		password: null,
		showPassword: false
	})

	const handleUserInput = ({ target }) => {
		let { value } = target
		if (value === '') {
			value = null
		} else {
			value = value.toUpperCase().replace(/ /g, '_')
		}

		setState({
			...state,
			user: value
		})
	}

	const handlePasswordInput = ({ target }) => {
		let { value } = target 

		if (value === '') {
			value = null
		}

		setState({
			...state,
			password: value
		})
	}

	const handleShowPassword = ({ target }) => {
		setState({
			...state,
			showPassword: target.checked
		})
	}

	const sendLogin = async () => {
		if (state.user === null || state.password === null) {
			return notification.error({
				message: 'Validation Error',
				description: 'All fields are required'
			})
		}

		let req = await request('/api/users/login')
		.post()
		.addBody({
			user_name: state.user,
			password: state.password
		})
		.send()

		if (req.status === 200) {
			storage.set('user', req.body.payload.user_name)
			notification.success({
				message: 'Log In successfully',
				description: `Welcome ${req.body.payload.user_name}.`
			})

			return history.push('/')
		}

		return notification.error({
			message: 'Credential Error',
			description: 'The user doesn\'t exist or the credentials are incorrect.'
		})
	}

	const passwordIcon = () => {
		if (state.showPassword) {
			return <UnlockOutlined />
		}

		return <LockOutlined />
	}

	return (
		<Container span={14}>
			<Form
				style={formStyle}
				labelCol={{span: 6}}
				wrapperCol={{span: 18}}
			>
				<Form.Item label="User Name">
					<Input
						onInput={handleUserInput}
						value={state.user}
						placeholder="User Name"
						prefix={<UserOutlined />}
					/>
				</Form.Item>
				<Form.Item label="Password">
					<Input
						onInput={handlePasswordInput}
						value={state.password}
						placeholder="Password"
						type={(state.showPassword)? 'text' : 'password'}
						prefix={passwordIcon()}
					/>
				</Form.Item>
				<Form.Item wrapperCol={{span: 18, offset: 6}}>
					<Checkbox
						onChange={handleShowPassword}
						checked={state.showPassword}
					>Show Password</Checkbox>
				</Form.Item>
				<Form.Item wrapperCol={{span: 18, offset: 6}}>
					<Button
						style={buttonStyles}
						onClick={sendLogin}
						type="primary"
					>Log In</Button>
					<ButtonLink
						style={buttonStyles}
						to="register"
						type="link"
					>Sign Up</ButtonLink>
				</Form.Item>
			</Form>
		</Container>
	)
}

export default Login
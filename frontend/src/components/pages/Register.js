import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { formStyle, buttonStyles } from '../../styles'

import { Container } from '../Container'
import { ButtonLink } from '../ButtonLink'
import { Form, Input, Checkbox, Button } from 'antd'
import { notification } from 'antd'

import { UserOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { request } from '../../lib'

const Register = () => {
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

	const sendRegister = async () => {
		if (state.user === null || state.password === null) {
			return notification.error({
				message: 'Validation Error',
				description: 'All fields are required'
			})
		}

		let req = await request('/api/users')
		.post()
		.addBody({
			user_name: state.user,
			password: state.password
		})
		.send()

		if (req.status === 201) {
			notification.success({
				message: 'User created successfully',
			})

			return history.push('/login')
		}

		return notification.error({
			message: 'Connection Error',
			description: `<${req.body.error.name}(${req.body.error.description?? ''})>`
		})
	}

	const sendOnEnter = ({code}) => {
		if (code === 'Enter') {
			return sendRegister()
		}
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
						onKeyDown={sendOnEnter}
						value={state.user}
						placeholder="User Name"
						prefix={<UserOutlined />}
					/>
				</Form.Item>
				<Form.Item label="Password">
					<Input
						onInput={handlePasswordInput}
						onKeyDown={sendOnEnter}
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
						onClick={sendRegister}
						type="primary"
					>Sign Up</Button>
					<ButtonLink
						style={buttonStyles}
						to="/login"
						type="link"
					>Log In</ButtonLink>
				</Form.Item>
			</Form>
		</Container>
	)
}

export default Register
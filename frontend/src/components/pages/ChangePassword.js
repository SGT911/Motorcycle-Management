import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { formStyle } from '../../styles'

import { Form, Input, Checkbox, Button } from 'antd'
import { Divider, notification } from 'antd'

import { NavBar } from '../NavBar'
import { Container } from '../Container'

import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { request, storage } from '../../lib'

const ChangePassword = () => {
	const history = useHistory()
	const [state, setState] = useState({
		actualPassword: null,
		newPassword: null,
		confirmPassword: null,
		showPassword: false
	})

	const handleUniversalInput = (field) => ({target}) => {
		let { value } = target
		if (value === '') {
			value = null
		}

		setState({
			...state,
			[field]: value
		})
	}

	const handleShowPassword = ({ target }) => {
		setState({
			...state,
			showPassword: target.checked
		})
	}

	const passwordIcon = () => {
		if (state.showPassword) {
			return <UnlockOutlined />
		}

		return <LockOutlined />
	}

	const inputType = () => (state.showPassword)? 'text' : 'password'

	const sendOnEnter = ({ code }) => {
		if (code === 'Enter') {
			send()
		}
	}

	const send = async () => {
		if (
			state.actualPassword  === null ||
			state.newPassword     === null ||
			state.confirmPassword === null
		) {
			return notification.error({
				message: 'Validation Error',
				description: 'All fields are required'
			})
		}

		if (state.newPassword !== state.confirmPassword) {
			return notification.error({
				message: 'Validation Error',
				description: 'The new passwords doesn\'t match, check and try again'
			})
		}

		let req = await request('/api/users/login')
		.post()
		.addBody({
			user_name: storage.get('user'),
			password: state.actualPassword
		})
		.send()

		if (req.status !== 200) {
			return notification.error({
				message: 'Credentials Error',
				description: 'The actual password doesn\'t satisfy the authentication, check and try again'
			})
		}

		req = await request('/api/users/password')
		.put()
		.addBody({
			user_name: storage.get('user'),
			password: state.newPassword
		})
		.send()

		if (req.status === 200) {
			notification.success({
				message: 'Password changed successfully',
			})

			return history.push('/')
		}

		return notification.error({
			message: 'Connection Error',
			description: `<${req.body.error.name}(${req.body.error.description?? ''})>`
		})
	}

	return (
		<React.Fragment>
			<NavBar path="/changePassword" />
			<Container span={14}>
				<Form
					style={formStyle}
					labelCol={{span: 10}}
					wrapperCol={{span: 14}}
				>
					<Form.Item label="Actual Password">
						<Input
							value={state.actualPassword}
							prefix={passwordIcon()}
							onInput={handleUniversalInput("actualPassword")}
							onKeyDown={sendOnEnter}
							type={inputType()}
							placeholder="Actual Password"
						/>
					</Form.Item>
					<Divider />
					<Form.Item label="New Password">
						<Input
							value={state.newPassword}
							prefix={passwordIcon()}
							onInput={handleUniversalInput("newPassword")}
							onKeyDown={sendOnEnter}
							type={inputType()}
							placeholder="New Password"
						/>
					</Form.Item>
					<Form.Item label="Confirm New Password">
						<Input
							value={state.confirmPassword}
							prefix={passwordIcon()}
							onInput={handleUniversalInput("confirmPassword")}
							onKeyDown={sendOnEnter}
							type={inputType()}
							placeholder="Confirm New Password"
						/>
					</Form.Item>
					<Form.Item
						wrapperCol={{offset: 10, span: 14}}
					>
						<Checkbox
							checked={state.showPassword}
							onChange={handleShowPassword}
						>Show Password</Checkbox>
					</Form.Item>
					<Form.Item
						wrapperCol={{offset: 10, span: 14}}
					>
						<Button
							type="primary"
							onClick={send}
						>Save</Button>
					</Form.Item>
				</Form>
			</Container>
		</React.Fragment>
	)
}
	
export default ChangePassword
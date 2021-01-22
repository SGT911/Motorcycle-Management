import React, { useEffect, useRef, useState } from 'react'
import { NavBar } from '../NavBar'
import { Container } from '../Container'
import { LoadPoints } from '../LoadPoints'
import { Typography, Divider, Button, Collapse, Popover, notification } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'

import config from '../../config'
import { buttonStyles } from '../../styles'
import { request, storage } from '../../lib'
import { toDateString, today, toTimeString } from '../../lib/dates'

const App = () => {
	let socket = useRef(null)
	const [state, setState] = useState({
		loaded: false,
		day: today(),
		availableResources: null,
		resources: []
	})

	useEffect(() => {
		const asyncFunc = async () => {
			let { available_resources } = await config.appConfig()
			let resources = await request(`/api/resources/${toDateString(state.day)}`).forceNoCache().get().send()
			
			setState({
				...state,
				loaded: true,
				availableResources: available_resources,
				resources: resources.body.payload.map(el => {
					return {
						...el,
						resource_date: new Date(el.resource_date)
					}
				})
			})
		}

		const loadSocket = () => {
			let protocol = (window.location.protocol === 'https:')? 'wss:' : 'ws:'
			let origin = config.apiOrigin.replace(new RegExp(window.location.protocol), '')
			let innerSocket = new WebSocket(`${protocol}${origin}/ws/resources/${toDateString(state.day)}`)

			const handlers = {
				add_user({user_name, time}) {
					let resources = state.resources.map(el => {
						if (toTimeString(el.resource_date) === time) {
							el.users.push(user_name)
						}

						return el
					})

					setState({
						...state,
						resources
					})
				},
				remove_user({user_name, time}) {
					let resources = state.resources.map(el => {
						if (toTimeString(el.resource_date) === time) {
							el.users = el.users.filter(el => user_name !== el)
						}

						return el
					})

					setState({
						...state,
						resources
					})
				},
				error({name, description}) {
					notification.error({
						message: `Error: ${name}`,
						description
					})
				}
			}

			innerSocket.addEventListener('open', () => console.log('Opened'))
			innerSocket.addEventListener('message', (evt) => {
				let { data } = evt
				data = JSON.parse(data)

				if (handlers.hasOwnProperty(data.action)) {
					handlers[data.action](data.payload)
				} else {
					console.warn(data)
				}
			})

			socket.current = innerSocket
		}

		if (!state.loaded) {
			asyncFunc()
		} else if (socket.current === null) {
			loadSocket()
		}
	}, [state])

	const availableResource = (users) => <span style={{display: 'inline-block', textAlign: 'right'}}>
		Available: {state.availableResources - users}
	</span>

	const resourceButton = (el) => {
		let user = storage.get('user')
		let resourceIsUsed = el.users.indexOf(user) !== -1
		let action = (resourceIsUsed)? 'Detach' : 'Attach'

		let sendAction = () => {
			const payload = {
				user_name: user,
				time: toTimeString(el.resource_date)
			}

			if (el.resource_date < today()) {
				return notification.warning({
					message: 'This date is read only',
					description: 'All dates before today can not be modified'
				})
			}


			if (action === 'Attach' && !resourceIsUsed) {
				if (el.users.length >= state.availableResources) {
					return notification.warning({
						message: 'The resource is full'
					})
				}

				socket.current.send(JSON.stringify({
					action: `attach_resource`,
					payload
				}))
			} else if (action === 'Detach') {
				socket.current.send(JSON.stringify({
					action: `detach_resource`,
					payload
				}))
			}
		}

		return <Button
			danger={resourceIsUsed}
			onClick={sendAction}
		>{action}</Button>
	}

	const changeDate = (step) => () => {
		let day = state.day
		day.setDate(day.getDate() + step)

		socket.current.close()
		socket.current = null

		setState({
			...state,
			day,
			loaded: false
		})
	}

	const refreshData = () => {
		socket.current.close()
		socket.current = null

		setState({
			...state,
			loaded: false
		})
	}

	return (
		<React.Fragment>
			<NavBar path="/" />
			<Container span={10}>
				{
					(state.loaded)?
						<Typography>
							<Typography.Paragraph>
								Date: <Typography.Text strong>{state.day.toLocaleDateString()}</Typography.Text>
							</Typography.Paragraph>
							<Typography.Paragraph>
								<Button style={buttonStyles} onClick={refreshData} type="dashed">Refresh</Button>
							</Typography.Paragraph>
							<Typography.Paragraph>
								<Button style={buttonStyles} onClick={changeDate(-1)} danger>
									<DownOutlined />
									Previous Day
								</Button>
								<Button style={buttonStyles} onClick={changeDate(1)} type="primary">
									<UpOutlined />
									Next Day
								</Button>
							</Typography.Paragraph>
							<Divider />
							<Collapse accordion>
								{
									state.resources.map(el => <Collapse.Panel
										key={el.resource_date}
										header={el.resource_date.toLocaleTimeString()}
										extra={availableResource(el.users.length)}
									>
										<React.Fragment>
											{
												(el.users.length > 0)? 
														<Typography.Paragraph>
															Users: {
																el.users.map(user => <Popover
																		key={user}
																		content={user}
																	>
																	<img
																		style={{width: '40px', marginRight: '10px'}}
																		src={`${config.apiOrigin}/api/users/${user}/avatar`}
																		alt={`User: ${user}`}
																	/>
																</Popover>)
															}
														</Typography.Paragraph>
												:
													<Typography.Paragraph style={{textAlign: 'center'}}>
														No body use this resource
													</Typography.Paragraph>
											}
											{ resourceButton(el) }
										</React.Fragment>
									</Collapse.Panel>)
								}
							</Collapse>
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
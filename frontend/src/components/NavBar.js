import { useHistory } from 'react-router-dom'

import { Menu } from 'antd'
import { Switch } from 'antd'
import {
	HomeOutlined,
	FileUnknownOutlined,
	LogoutOutlined,
	LockOutlined,
	UserOutlined
} from '@ant-design/icons'
import { storage } from '../lib'

const routes = [
	{
		name: 'Home',
		path: '/',
		icon: HomeOutlined
	},
	{
		name: 'Test',
		path: '/test',
		icon: FileUnknownOutlined
	}
]

export const NavBar = ({ path }) => {
	const history = useHistory()

	const handleClick = ({ key }) => {
		if (key !== 'ignore' && key !== path) {
			history.push(key)
		}
	}
	const handleTheme = (dark) => {
		storage.set('theme', (dark)? 'dark' : 'light')
		window.location.reload()
	}

	return (
		<Menu onClick={handleClick} selectedKeys={[path]} mode="horizontal">
			{
				routes.map(route => {
					return <Menu.Item
						key={route.path}
						icon={<route.icon />}
					>
						{route.name}
					</Menu.Item>
				})
			}
			<Menu.SubMenu
				key="ignore"
				title="User"
				icon={<UserOutlined />}
			>
				<Menu.Item key="/logout" icon={<LogoutOutlined />}>
					Log Out
				</Menu.Item>
				<Menu.Item key="ignore" icon={<LockOutlined />}>
					Change Password
				</Menu.Item>
			</Menu.SubMenu>
			<Menu.Item
				key="ignore"
				style={{ float: 'right' }}
			>
				<Switch
					defaultChecked={storage.get('theme') === 'dark'}
					onClick={handleTheme}
				/> Dark theme
			</Menu.Item>
		</Menu>
	)
}
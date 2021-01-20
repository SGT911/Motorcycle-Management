import { Link } from 'react-router-dom'

export const ButtonLink = ({ to, children, type }) => {
	if (!type) {
		type = 'link'
	}

	return (
		<Link
			to={to}
			className={`ant-btn ant-btn-${type}`}
		>
			{children}
		</Link>
	)
}
import { Link } from 'react-router-dom'

/**
 * @param {{
 * 	to: string;
 *  children: JSX.Element;
 *  type?: 'link' | 'default' | 'primary' | 'dangerous';
 * }} props 
 */
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
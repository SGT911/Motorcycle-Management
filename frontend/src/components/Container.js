import {Row, Col} from 'antd'

const containerStyle = {
	marginTop: '2em'
}

/**
 * @param {{
 * 	span: number;
 * 	children: JSX.Element;
 * }} props
 */
export const Container = ({span, children}) => {
	if ((span % 2) !== 0) {
		throw new Error("The span property must be a pair number")
	}

	let offset = (24 - span) / 2

	return (
		<Row>
			<Col
				style={containerStyle}
				xs={{span: 20, offset: 2}}
				sm={{span: 18, offset: 3}}
				md={{span, offset}}
			>
				{children}
			</Col>
		</Row>
	)
}
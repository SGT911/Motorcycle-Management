import {Row, Col} from 'antd'

const containerStyle = {
	marginTop: '2em'
}

export const Container = ({span, children}) => {
	if ((span % 2) !== 0) {
		throw new Error("The span property must be a pair number")
	}

	let offset = (24 - span) / 2

	return (
		<Row>
			<Col style={containerStyle} span={span} offset={offset}>
				{children}
			</Col>
		</Row>
	)
}
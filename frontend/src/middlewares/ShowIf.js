export const ShowIf = ({validation, children}) => {
	if (validation()) return children

	return null
}
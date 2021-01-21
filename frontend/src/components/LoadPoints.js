import React from 'react'
import { range } from '../lib'

import './styles/LoadPoints.css'

/**
 * 
 * @param {number} delay
 * @param {number} time
 * @returns {React.CSSProperties}
 */
const pointAnimation = (time, delay) => {
	return {
		animationName: 'LoadPoints-animation',
		animationDuration: `${time}s`,
		animationTimingFunction: 'ease',
		animationIterationCount: 'infinite',
		animationDelay: `${delay}s`
	}
}

/**
 * 
 * @param {{
 * 	count: number
 * 	time: number
 * }} props
 */
export const LoadPoints = ({ count, time }) => {
	if (!count) {
		count = 3
	}

	if (!time) {
		time = 2
	}

	return (
		<React.Fragment>
			{
				range(count, 0, 0.25).map(num => {
					return <span key={num} style={pointAnimation(time, num)}>.</span>
				})
			}
		</React.Fragment>
	)
}
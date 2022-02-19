import React from 'react'

function Card({ title, data, extraData }) {
	return (
		<div className='w-60 bg-white p-4 rounded-xl shadow-md space-y-2'>
			<div className='text-gray-600 text-sm'>{title}</div>
			<div className='font-semibold text-2xl'>
				{data}
				<span className='text-base'>&nbsp;{extraData}</span>
			</div>
		</div>
	)
}

export default Card

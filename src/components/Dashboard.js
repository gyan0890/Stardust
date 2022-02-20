import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Pie,
	PieChart,
	Cell,
} from 'recharts'
import defaultData from '../defaultResp.json'

function Dashboard() {
	let sentimentUrl = 'http://34.211.151.159:8080/sentiment/text?text='
	let nftPriceUrl =
		'http://54.200.253.193:8080/nft/collection?chain_id=1&collection_address=0xd07dc4262bcdbf85190c01c996b4c06a461d2430'

	// data to send
	const [collectioName, setCollectionName] = useState('-')
	const [symbol, setSymbol] = useState('-')
	const [currFloor, setCurrFloor] = useState(0)
	const [noTokens, setNoTokens] = useState(0)

	const [selectedChainId, setSelectedChainId] = useState(1)
	const [lineChartData, setLineChartDate] = useState([])
	const [pieChartData, setPieChartData] = useState([
		{ sentiment: 'positive', value: 67 },
		{ sentiment: 'negetive', value: 33 },
	])
	const colors = ['#34d399', '#d13447']

	useEffect(() => {
		setCollectionName(defaultData.collection_name)
		setSymbol(defaultData.collection_ticker_symbol)
		setCurrFloor(defaultData.current_7day_floor_price)
		setNoTokens(defaultData.number_nfts_in_collection)
		setLineChartDate(defaultData.floor_price_hist.reverse())
		// let pos = defaultData.classifications.filter(
		// 	(obj) => obj.classification === 'Positive'
		// ).length
		// let neg = defaultData.classifications.filter(
		// 	(obj) => obj.classification === 'Negative'
		// ).length
		// setPieChartData([
		// 	{ sentiment: 'positive', value: pos },
		// 	{ sentiment: 'negetive', value: neg },
		// ])
		console.log(defaultData)
	}, [])

	function submitForm(e) {
		e.preventDefault()
		let contractSearch = e.target[1].value
		let chainId = e.target[0].value
		axios
			.get(
				'http://34.211.151.159:8080/nft/collection?chain_id=' +
					chainId +
					'&collection_address=' +
					contractSearch
			)
			.then((resp) => {
				console.log(resp.data)
				setCollectionName(resp.data.collection_name)
				setSymbol(resp.data.collection_ticker_symbol)
				setCurrFloor(resp.data.current_7day_floor_price)
				setNoTokens(resp.data.number_nfts_in_collection)
				setLineChartDate(resp.data.floor_price_hist.reverse())

				//get sentiments
				axios
					.get(sentimentUrl + collectioName)
					.then((resp) => {
						console.log(resp)
						let pos = resp.data.classifications.filter(
							(obj) => obj.classification === 'Positive'
						).length
						let neg = resp.data.classifications.filter(
							(obj) => obj.classification === 'Negative'
						).length
						setPieChartData([
							{ sentiment: 'positive', value: pos },
							{ sentiment: 'negetive', value: neg },
						])
					})
					.catch((err) => console.log(err))
			})
		e.target[1].value = ''
	}

	const renderLineChart = (
		<LineChart
			width={600}
			height={400}
			data={lineChartData}
			margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
		>
			<Line
				type='monotone'
				dataKey='floor_price_quote_7d'
				stroke='#8884d8'
				strokeWidth={2}
				dot={false}
			/>
			{/* <CartesianGrid stroke='#ccc' strokeDasharray='5 5' /> */}
			<XAxis dataKey='opening_date' minTickGap={15} />
			<YAxis />
			<Tooltip />
		</LineChart>
	)

	const dataList =
		selectedChainId == 1 ? (
			<datalist id='contracts'>
				<option value='0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'>
					BoredApes
				</option>
				<option value='0x1a92f7381b9f03921564a437210bb9396471050c'>
					Cool Cats
				</option>
				<option value='0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7'>
					Meebits{' '}
				</option>
			</datalist>
		) : (
			<datalist id='contracts'>
				<option value='0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'>
					h1
				</option>
				<option value='0x1a92f7381b9f03921564a437210bb9396471050c'>
					Cool h2
				</option>
				<option value='0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7'>
					h2{' '}
				</option>
			</datalist>
		)

	return (
		// overflow h=90vh
		<div className='p-8 z-10 h-[100vh] overflow-y-scroll'>
			<form action='submit' onSubmit={(e) => submitForm(e)}>
				<select
					name='chainId'
					id='chainId'
					className='inp text-white'
					onChange={(e) => setSelectedChainId(e.target.value)}
				>
					<option
						value='1'
						className='text-black'
						selected='selected'
					>
						Eth
					</option>
					<option value='2' className='text-black'>
						Harmony
					</option>
					<option value='3' className='text-black'>
						Polygon
					</option>
				</select>
				<input
					type='text'
					placeholder='Contract address'
					className='inp w-96 ml-5 rounded-r-none'
					list='contracts'
					required
				></input>
				{dataList}
				<input
					type='submit'
					value='🔍'
					className='inp rounded-l-none border-l-0 bg-white cursor-pointer'
				/>
			</form>

			{/* cards and data  */}
			<div>
				{/* info cards  */}
				<div className='grid grid-cols-4 mt-20'>
					<Card title={'Collection Name'} data={collectioName} />
					<Card title={'Symbol'} data={symbol} />
					<Card
						title={'Current Floor Price'}
						data={currFloor}
						extraData={'USD'}
					/>
					<Card
						title={'No of tokens in collection'}
						data={noTokens}
					/>
				</div>
				{/* plots  */}
				<div className='flex mt-10 space-x-16'>
					<div className='w-[50rem] bg-[#181E4D] rounded-md shadow-xl p-3 flex items-center'>
						{renderLineChart}
						<span className='text-white'>Floor Price in USD</span>
					</div>
					<div className='w-[17rem] bg-white rounded-md shadow-xl p-3'>
						<div className='text-gray-600 text-sm'>
							Community Sentiment(based on latest tweets)
						</div>
						<div className=''>
							<PieChart width={250} height={250}>
								<Pie
									data={pieChartData}
									dataKey='value'
									nameKey='sentiment'
									cx='50%'
									cy='50%'
									innerRadius={50}
									outerRadius={80}
									fill='#82ca9d'
									paddingAngle={3}
									label
								>
									{pieChartData.map((entry, index) => (
										<Cell
											fill={colors[index % colors.length]}
										/>
									))}
								</Pie>
							</PieChart>
							{/* labels */}
							<div>
								<span className='mr-2 border-[1px] border-black bg-emerald-400 text-emerald-400'>
									00
								</span>
								Positive
							</div>
							<div className='mt-3'>
								<span className='mr-2 border-[1px] border-black bg-[#d13447] text-[#d13447]'>
									00
								</span>
								Negetive
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard

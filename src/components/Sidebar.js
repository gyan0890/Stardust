import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

function Sidebar() {
	const [currentAccount, setCurrentAccount] = useState()
	const [active, setActive] = useState(1) //1-dashboard, 2-submit, 3- claim

	useEffect(() => {
		checkWallet()
	}, [])
	const checkWallet = async () => {
		try {
			const { ethereum } = window
			if (!ethereum) {
				console.log('Make sure you have metamask')
				return
			} else {
				console.log('Ethereum object is present')
			}

			/*
			 * Check if we're authorized to access the user's wallet
			 */
			const accounts = await ethereum.request({ method: 'eth_accounts' }) //checks if any account is connected
			if (accounts.length !== 0) {
				const account = accounts[0]
				console.log('Found an authorized account:', account)
				setCurrentAccount(account)
			} else {
				console.log('No authorized account found')
			}
			return accounts[0]
		} catch (err) {
			console.log(err)
		}
	}
	const connectWallet = async () => {
		try {
			const { ethereum } = window
			if (!ethereum) {
				alert('Make sure you have MetaMask!')
				return
			}
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			}) //request coonection
			console.log('Connected', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<div className='bg-zinc-100 h-screen w-[20%] rounded-r-3xl p-5 z-10 min-w-[270px]'>
			<div className='text-3xl font-bold text-center font-mono text-blue-400'>
				Stardust✧
			</div>
			<div className='mt-10 space-y-3'>
				<Link to='/' onClick={() => setActive(1)}>
					<div
						className={`sideDef ${
							active == 1
								? 'border-b-0 border-l-4 border-blue-600 bg-purple-200 rounded-xl transition-colors duration-150'
								: ''
						}`}
					>
						Dashboard
					</div>
				</Link>
				<Link to='/submit-nft' onClick={() => setActive(2)}>
					<div
						className={`sideDef ${
							active == 2
								? 'border-b-0 border-l-4 border-blue-600 bg-purple-200 rounded-xl transition-colors duration-150'
								: ''
						}`}
					>
						Submit nft
					</div>
				</Link>
				<Link to='/claim-nft' onClick={() => setActive(3)}>
					<div
						className={`sideDef ${
							active == 3
								? 'border-b-0 border-l-4 border-blue-600 bg-purple-200 rounded-xl transition-colors duration-150'
								: ''
						}`}
					>
						Claim nft
					</div>
				</Link>
				<div className='h-[27rem] flex items-end'>
					<button
						className='p-2 bg-purple-500 rounded-lg text-white cursor-pointer shadow-md w-full hover:text-purple-500 hover:bg-white transition-all duration-150 border-white border-2 hover:border-purple-500 hover:shadow-2xl active:scale-95 font-semibold truncate'
						onClick={connectWallet}
					>
						{!currentAccount
							? 'Connect Wallet'
							: 'Hi! ' + currentAccount}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Sidebar

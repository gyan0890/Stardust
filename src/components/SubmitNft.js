import {
	starDustContractAddress,
	starDustABI,
	nftContractABI,
	erc20ABI,
} from '../contractDetails'
import { ethers } from 'ethers'
import { useState } from 'react'

function SubmitNft() {
	const [mintedTokenAddr, setMintedTokenAddr] = useState()
	const [loading, setLoading] = useState(false)
	const [loadingMsg, setLoadingMsg] = useState('')
	async function generateLiq(e) {
		e.preventDefault()
		//console.log(e.target[0].value, e.target[1].value, e.target[2].value)
		try {
			let chainId = e.target[0].value
			let tokenId = e.target[2].value
			let nftContractAddr = e.target[1].value

			//not handling edge case right now
			const { ethereum } = window
			console.log(ethereum)
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			const stardustContract = new ethers.Contract(
				starDustContractAddress,
				starDustABI,
				signer
			)
			const nftContract = new ethers.Contract(
				nftContractAddr,
				nftContractABI,
				signer
			)
			setLoading(true)
			//step 1 approve nftContract
			let tx1 = await nftContract.approve(
				starDustContractAddress,
				tokenId
			)
			setLoadingMsg('Approving the transaction, just hold on!')
			await tx1.wait()
			if (tx1) {
				console.log('approved')
				setLoadingMsg('Approved, hold on for other transactions')
				//step 2 submit nft to stardust
				let tx2 = await stardustContract.depositNftPool(
					nftContractAddr,
					tokenId
				)
				await tx2.wait()
				setLoadingMsg('Depositing your NFT')
				if (tx2) {
					console.log('nft deposited to contract')
					// get minted erc20 tokens
					setLoadingMsg('Sending you Tokens')
					await stardustContract
						.getTokenContract(nftContractAddr)
						.then((resp) => {
							console.log('all calls completed')
							setMintedTokenAddr(resp)
							setLoading(false)
							setLoadingMsg(
								'Tokens sent!! Add this address ' +
									resp +
									' to your wallet'
							)
						})
				}
			}
		} catch (err) {
			console.log(err)
			setLoading(false)
			setLoadingMsg('Daya, kuch toh gadbad hai')
		}
	}
	return (
		<div className='h-[90vh] w-full flex justify-center items-center'>
			<div className='w-[40rem] h-[32rem] bg-gradient-to-br from-[#7543a3] to-blue-400 rounded-xl p-10'>
				<div className='font-bold font-mono text-5xl text-white mb-5'>
					Submit Nft
				</div>
				<form action='submit' onSubmit={(e) => generateLiq(e)}>
					<select
						name='chainId'
						id='chainId'
						className='inp text-white'
					>
						<option value='1' className='text-black'>
							Eth
						</option>
						<option
							value='2'
							className='text-black'
							selected='selected'
						>
							Harmony
						</option>
						<option value='3' className='text-black'>
							Polygon
						</option>
					</select>
					<input
						type='text'
						placeholder='Contract address'
						className='inp w-96 ml-5 '
						list='contracts'
						required
					></input>
					<datalist id='contracts'>
						<option value='0x8EdE3EE68Af973022A389A9214da20e2C7F9280B'>
							spaceKayak 1(H)
						</option>
						<option value='0x29ABd334B02D53D0b7dCFb03929DaC8263044823'>
							spaceKayak 2(H)
						</option>
						<option value='0xb1e5Bc96C4F958C713896EFf6B1DF6CA8baD55DD'>
							spaceKayak 3(H)
						</option>
					</datalist>
					<div className=' text-white text-4xl text-center mt-10 font-serif'>
						Input the Token Id:
					</div>
					<div className='flex justify-center mt-12'>
						<input
							type='number'
							className='inp'
							required
							placeholder='Token Id you hold'
						/>
					</div>
					<div className='flex justify-center mt-10'>
						{!loading ? (
							<input
								type='submit'
								value='Generate Liqudity'
								className='inp  border-l-0 bg-white text-black cursor-pointer'
							/>
						) : (
							<>
								<div className='mt-10 text-center animate-pulse text-white font-bold font-mono text-xl'>
									Loading. Please wait...
									{mintedTokenAddr}
								</div>
							</>
						)}
					</div>
					<div className='my-5 text-center text-white font-bold font-mono text-xl'>
						{loadingMsg}
					</div>
				</form>
			</div>
		</div>
	)
}

export default SubmitNft

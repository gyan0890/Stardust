import { ethers } from 'ethers'
import { useState } from 'react'
import {
	starDustContractAddress,
	starDustABI,
	nftContractABI,
	erc20ABI,
} from '../contractDetails'
//0x8EdE3EE68Af973022A389A9214da20e2C7F9280B

function ClaimNft() {
	const [loading, setLoading] = useState(false)
	const [loadingMsg, setLoadingMsg] = useState('')
	async function claim(e) {
		try {
			e.preventDefault()
			//console.log(e.target[0].value, e.target[1].value, e.target[2].value)

			let chainId = e.target[0].value
			let tokenId = e.target[2].value
			let nftContractAddr = e.target[1].value

			//not handling edge case right now
			const { ethereum } = window
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
			let erc20ContractAddr = ''
			await stardustContract
				.getTokenContract(nftContractAddr)
				.then((resp) => (erc20ContractAddr = resp))

			const erc20Contract = new ethers.Contract(
				erc20ContractAddr,
				erc20ABI,
				signer
			)

			// let tx2 = await stardustContract.claimNFT(nftContractAddr, tokenId)
			// await tx2.wait()
			//step 1 approve erc20
			setLoading(true)
			setLoadingMsg('Waiting for approval')
			let tx1 = await erc20Contract.approve(
				starDustContractAddress,
				ethers.utils.parseUnits('100', 18)
			)
			await tx1.wait()
			if (tx1) {
				console.log('approved')
				setLoadingMsg('Got the approval, claiming your nft')
				//step 2 claim nft from stardust
				let tx2 = await stardustContract.claimNFT(
					nftContractAddr,
					tokenId
				)
				await tx2.wait()
				if (tx2) {
					console.log('nft Claimed back')
					setLoadingMsg(
						'Claimed back NFT successfully,\n Check your wallet'
					)
					setLoading(false)
					// get minted erc20 tokens
					// await stardustContract
					// 	.getTokenContract(nftContractAddr)
					// 	.then((resp) => {
					// 		console.log('all calls completed')
					// 	})
				}
			}
		} catch (err) {
			setLoading(false)
			setLoadingMsg('Daya, kuch toh gadbad hai')
		}
	}
	return (
		<div className='h-[90vh] w-full flex justify-center items-center'>
			<div className='w-[40rem] h-[32rem] bg-gradient-to-tl from-[#7543a3] to-blue-400 rounded-xl p-10'>
				<div className='font-bold font-mono text-5xl text-white mb-5'>
					Claim Nft
				</div>
				<form action='submit' onSubmit={claim}>
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
							placeholder='Token Id you want'
						/>
					</div>
					<div className='flex justify-center mt-10'>
						{!loading ? (
							<input
								type='submit'
								value='Claim your Nft'
								className='inp  border-l-0 bg-white text-black cursor-pointer'
							/>
						) : (
							<div className='mt-10 text-center animate-pulse text-white font-bold font-mono text-xl'>
								Loading. Please wait...
							</div>
						)}
					</div>
				</form>
				<div className='my-5 text-center text-white font-bold font-mono text-xl'>
					{loadingMsg}
				</div>
			</div>
		</div>
	)
}

export default ClaimNft

import { ethers } from 'ethers'
import {
	starDustContractAddress,
	starDustABI,
	nftContractABI,
	erc20ABI,
} from '../contractDetails'
//0x8EdE3EE68Af973022A389A9214da20e2C7F9280B

function ClaimNft() {
	async function claim(e) {
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
		const erc20Contract = new ethers.Contract(
			'0xB024360c0fd8fD094506AA56eA41De664AED615F',
			erc20ABI,
			signer
		)

		// let tx2 = await stardustContract.claimNFT(nftContractAddr, tokenId)
		// await tx2.wait()
		//step 1 approve erc20
		let tx1 = await erc20Contract.approve(
			starDustContractAddress,
			ethers.utils.parseEther('200')
		)
		await tx1.wait()
		if (tx1) {
			console.log('approved')
			//step 2 claim nft from stardust
			let tx2 = await stardustContract.claimNFT(nftContractAddr, tokenId)
			await tx2.wait()
			if (tx2) {
				console.log('nft Claimed back')
				// get minted erc20 tokens
				// await stardustContract
				// 	.getTokenContract(nftContractAddr)
				// 	.then((resp) => {
				// 		console.log('all calls completed')
				// 	})
			}
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
							spacekayak1
						</option>
						<option value='0x1a92f7381b9f03921564a437210bb9396471050c'>
							Cool Cats
						</option>
						<option value='0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7'>
							Meebits{' '}
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
						<input
							type='submit'
							value='Claim your Nft'
							className='inp  border-l-0 bg-white text-black cursor-pointer'
						/>
					</div>
				</form>
				<div className='mt-10 text-center animate-pulse text-white font-bold font-mono text-xl'>
					Loading. Please wait...
				</div>
			</div>
		</div>
	)
}

export default ClaimNft

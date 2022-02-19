import React from 'react'

function ClaimNft() {
	return (
		<div className='h-[90vh] w-full flex justify-center items-center'>
			<div className='w-[40rem] h-[32rem] bg-gradient-to-tl from-[#7543a3] to-blue-400 rounded-xl p-10'>
				<div className='font-bold font-mono text-5xl text-white mb-5'>
					Claim Nft
				</div>
				<form action='submit'>
					<select
						name='chainId'
						id='chainId'
						className='inp text-white'
					>
						<option value='1' className='text-black'>
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
						className='inp w-96 ml-5 '
						list='contracts'
						required
					></input>
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

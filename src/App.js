import Sidebar from './components/Sidebar'
import './App.css'
import Dashboard from './components/Dashboard'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SubmitNft from './components/SubmitNft'
import ClaimNft from './components/ClaimNft'

function App() {
	return (
		<Router>
			<div className='flex'>
				<Sidebar />
				{/* mainArea */}
				<div className='w-full relative'>
					<Switch>
						<Route path='/submit-nft'>
							<SubmitNft />
						</Route>
						<Route path='/claim-nft'>
							<ClaimNft />
						</Route>
						<Route path='/'>
							{/* data part */}
							<Dashboard />
						</Route>
					</Switch>
					{/* gradient for fun  */}
					<div className='h-[55vh] w-[101.5%] bg-white absolute bg-gradient-to-tr from-blue-500 to-emerald-500 via-purple-500 -left-5 top-0 -z-10 '>
						fd
					</div>
					<div className='h-[55vh] w-[101.5%] absolute bg-blue-100 -left-5 bottom-0 -z-10 '>
						fd
					</div>
				</div>
			</div>
		</Router>
	)
}

export default App

import { useState, useEffect, createContext, Dispatch, SetStateAction } from 'react'
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom'
import { Signin, Signup, Home } from './pages'
import './App.css'

interface IAuthStatus {
	isSignedIn: boolean;
}
export const authContext = createContext<[IAuthStatus | null,  Dispatch<SetStateAction<IAuthStatus | null>> | null ]>([null, null]);

function App() {
	const [authStatus , setAuthStatus] = useState<IAuthStatus | null>(null);  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
		  credentials: 'include',
        });
        const data = await res.json();
        setAuthStatus(data);  
      } catch (error) {
        console.error(error); 
      }
    })();
  }, []);
  console.log(authStatus)
  return (
	<div style={{ height: '100vh', width: '100%' }}>
		<authContext.Provider value={[authStatus, setAuthStatus]}>
			<BrowserRouter>
				{
					authStatus && !authStatus.isSignedIn && (
						!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && 
						<Navigate to='/login' />
					)
				}
				<Routes>
					<Route path='/register' element={<Signup />} />
					<Route path='/Login' element={<Signin />} />
					<Route path='/' element={<Home />} />
				</Routes>
			</BrowserRouter>
		</authContext.Provider>
	</div>
  )
}

export default App

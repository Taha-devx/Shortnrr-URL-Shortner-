
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './layout/app_layout'
import LandingPage from './pages/landing'
import DashboardPage from './pages/dashboard'
import AuthPage from './pages/auth'
import LinkPage from './pages/link'
import RedirectPage from './pages/redirecting'
import UrlProvider from './context'
import RequiredAuth from './components/require-auth'


const router = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:'/',
        element:<LandingPage/>
      },
      {
        path:'/dashboard',
        element:<RequiredAuth>
          <DashboardPage/>
        </RequiredAuth>
      },
      {
        path:'/auth',
        element:<AuthPage/>
      },
      {
        path:'/link/:id',
        element:<RequiredAuth>
          <LinkPage/>
        </RequiredAuth>
      },
      {
        path:'/:id',
        element:<RedirectPage/>
      },
    ]
  }
])


function App() {

  return (
    <UrlProvider>
      <RouterProvider router={router}/>
    </UrlProvider>
  )
}

export default App

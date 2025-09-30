import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'

const AppLayouts = () => {
  return (
    <div>
        <main className="min-h-screen container mx-auto px-5">
            <Header />
            <Outlet />
        </main>

        <div className='p-10 text-center bg-gray-800 mt-10 text-white'>
            Made with <em>❤️</em> by Shivam Roy
        </div>
      
    </div>
  )
}

export default AppLayouts

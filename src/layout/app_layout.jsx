import { Outlet } from "react-router-dom"
import React from 'react'
import Header from "@/components/header"

const AppLayout = () => {
  return (
    <div>
        <main className="min-h-screen w-full px-4">
           <Header />
           {/* body */} 
           <Outlet/>
        </main>

        <div className="p-10 text-center bg-gray-800 mt-10">
          Made to showcase skill sets
        </div>


    </div>
  )
}

export default AppLayout
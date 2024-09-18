import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <main className='w-full min-h-screen'>
                <Header />
                <div className='lg:px-10 px-6 py-4'>
                    <Outlet />
                </div>
            </main>
            <footer className='w-full p-10 text-center border-t  mt-10'>Made with 💖 by Arvind Kathare</footer>
        </div>
    )
}

export default AppLayout
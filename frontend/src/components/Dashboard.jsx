import React from 'react';
import logo from '../assets/logo.png';
import LevelMap from './game/LevelMap';

const Dashboard = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden font-sans">
            {/* Top Bar for stats (Lives, Gems, etc) */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-20 shadow-sm">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Macaw" className="h-10 w-auto" />
                    {/* <h1 className="text-xl font-bold text-gray-800 tracking-tight">Macaw</h1> */}
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full">
                        ❤️ 5
                    </div>
                    <div className="flex items-center gap-2 text-blue-500 font-bold bg-blue-50 px-3 py-1 rounded-full">
                        💎 120
                    </div>
                </div>
            </header>

            {/* Main Game Map Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50 relative custom-scrollbar">
                <LevelMap />
            </main>
        </div>
    );
};

export default Dashboard;

import React, { useState } from 'react';
import { Play, Pause, X, FastForward, Monitor } from 'react-feather';
import { useDemo } from '../../hooks/useDemo';

const DemoButton = () => {
    const [showModal, setShowModal] = useState(false);
    const {
        isActive,
        currentStep,
        isPlaying,
        speed,
        demoType,
        startDemo,
        stopDemo,
        togglePlay,
        changeSpeed
    } = useDemo();

    const handleStart = (type) => {
        startDemo(type);
        setShowModal(false);
    };

    if (isActive) {
        return (
            <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl p-4 border border-gray-200 w-80">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">
                        {demoType === 'user' ? 'User Demo' : 'Admin Demo'}
                    </h3>
                    <button onClick={stopDemo} className="text-gray-500 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        {currentStep?.action === 'wait' ? 'Waiting...' :
                            currentStep?.action === 'navigate' ? `Navigating to ${currentStep.value}` :
                                currentStep?.action === 'click' ? 'Clicking element' :
                                    currentStep?.action === 'fill' ? 'Filling form' :
                                        'Processing...'}
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <div className="flex space-x-2">
                        {[0.5, 1, 2].map((s) => (
                            <button
                                key={s}
                                onClick={() => changeSpeed(s)}
                                className={`px-2 py-1 text-xs rounded ${speed === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
            >
                <Monitor size={18} />
                <span className="font-medium">Watch Demo</span>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full m-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Watch Demo</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div
                                onClick={() => handleStart('user')}
                                className="p-4 border-2 border-gray-100 rounded-lg hover:border-purple-500 cursor-pointer transition-colors group"
                            >
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600">User Demo</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Experience the full ordering flow as a customer.
                                </p>
                            </div>

                            <div
                                onClick={() => handleStart('admin')}
                                className="p-4 border-2 border-gray-100 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors group"
                            >
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600">Admin Demo</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Manage orders and menu items as an administrator.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-400">
                            Demo mode uses simulated data and payments.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DemoButton;

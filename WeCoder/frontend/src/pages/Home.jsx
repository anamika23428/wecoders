import React from 'react';
import CodeEditor from '../components/CodeEditor';
import VideoCall from '../components/VideoCall';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-4xl font-bold mb-6">Welcome to Wecoder</h1>
            <div className="w-full max-w-4xl p-4 bg-white shadow-md rounded-lg">
                <CodeEditor />
                <VideoCall />
            </div>
        </div>
    );
};

export default Home;

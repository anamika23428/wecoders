// // import React, { useState, useEffect } from 'react';
// // import io from 'socket.io-client';

// // const socket = io('http://localhost:3000');

// // const CodeEditor = () => {
// //     const [code, setCode] = useState('// Write your code here...');

// //     useEffect(() => {
// //         // Receive the initial and subsequent code updates
// //         socket.on('codeUpdate', (updatedCode) => {
// //             setCode(updatedCode); // Update local state
// //         });

// //         // Cleanup socket listener on component unmount
// //         return () => {
// //             socket.off('codeUpdate');
// //         };
// //     }, []);

// //     const handleCodeChange = (event) => {
// //         const newCode = event.target.value;
// //         setCode(newCode); // Update local state
// //         socket.emit('codeUpdate', newCode); // Emit to the server
// //     };

// //     return (
// //         <textarea
// //             value={code}
// //             onChange={handleCodeChange}
// //             rows={20}
// //             cols={80}
// //             style={{ fontSize: '16px', fontFamily: 'monospace', width: '100%' }}
// //         />
// //     );
// // };

// // export default CodeEditor;
// // CodeEditor.jsx
// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

// const CodeEditor = () => {
//     const [code, setCode] = useState('// Write your code here...');

//     useEffect(() => {
//         socket.on('codeUpdate', (updatedCode) => {
//             setCode(updatedCode);
//         });

//         return () => {
//             socket.off('codeUpdate');
//         };
//     }, []);

//     const handleCodeChange = (event) => {
//         const newCode = event.target.value;
//         setCode(newCode);
//         socket.emit('codeUpdate', newCode);
//     };

//     return (
//         <textarea
//             value={code}
//             onChange={handleCodeChange}
//             rows={20}
//             cols={80}
//             style={{ fontSize: '16px', fontFamily: 'monospace', width: '100%' }}
//         />
//     );
// };

// export default CodeEditor;
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here...');
    const [language, setLanguage] = useState('python');
    const [inputData, setInputData] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    // Listen for updates from the server
    useEffect(() => {
        socket.on('codeUpdate', (updatedCode) => {
            setCode(updatedCode);
        });

        socket.on('outputUpdate', (updatedOutput) => {
            setOutput(updatedOutput);
        });

        return () => {
            socket.off('codeUpdate');
            socket.off('outputUpdate');
        };
    }, []);

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        console.log(newCode);
        if (socket.connected) {
            socket.emit('codeUpdate', newCode);
        } else {
            console.warn("Socket is not connected.");
        }
        
    };

    const handleRunCode = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/execute', {
                code,
                language,
                inputData,
            });
            const result = response.data.output || response.data.error;
            setOutput(result);
            socket.emit('outputUpdate', result); 
        } catch (error) {
            const errorMsg = 'Error while executing code.';
            setOutput(errorMsg);
            socket.emit('outputUpdate', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <header className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Collaborative Code Editor</h1>
                <div className="flex items-center mt-4 space-x-4">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring focus:ring-indigo-500"
                    >
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                    <button
                        onClick={handleRunCode}
                        disabled={loading}
                        className={`px-4 py-2 text-white font-bold rounded-md ${
                            loading
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-500 hover:bg-indigo-600'
                        }`}
                    >
                        {loading ? 'Running...' : 'Run Code'}
                    </button>
                </div>
            </header>

            <div className="w-full max-w-4xl">
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    rows={20}
                    className="w-full p-4 text-sm font-mono bg-white border rounded-md shadow-sm focus:ring focus:ring-indigo-500"
                />
            </div>

            {language === 'python' && (
                <div className="mt-4 w-full max-w-4xl">
                    <label className="block text-gray-600 font-medium mb-2">
                        Provide Input for input():
                    </label>
                    <input
                        type="text"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-500"
                        placeholder="Enter input for your program"
                    />
                </div>
            )}

            {language === 'cpp' && (
                <div className="mt-4 w-full max-w-4xl">
                    <label className="block text-gray-600 font-medium mb-2">
                        Provide Input for cin:
                    </label>
                    <textarea
                        rows="5"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-500"
                        placeholder="Enter input for your program (e.g., 5 10)"
                    />
                </div>
            )}

            <div className="mt-6 w-full max-w-4xl bg-white p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Output:</h2>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;


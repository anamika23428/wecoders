import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../App.css';

const socket = io('http://localhost:3000');

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here...');
    const [language, setLanguage] = useState('python'); // Selected language
    const [inputData, setInputData] = useState(''); // User's input for input() (Python) or cin (C++)
    const [output, setOutput] = useState(''); // Output or error message
    const [loading, setLoading] = useState(false); // Loading state

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
        socket.emit('codeUpdate', newCode);
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
        <div className="App">
            <header className="App-header">
                <h1>Collaborative Code Editor</h1>
                <div className="controls">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                    <button onClick={handleRunCode} disabled={loading}>
                        {loading ? 'Running...' : 'Run Code'}
                    </button>
                </div>
            </header>

            <div className="editor-container">
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    rows={20}
                    cols={80}
                    style={{ fontSize: '16px', fontFamily: 'monospace', width: '100%' }}
                />
            </div>

            {language === 'python' && (
                <div className="input-container">
                    <label>Provide Input for input(): </label>
                    <input
                        type="text"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder="Enter input for your program"
                    />
                </div>
            )}

            {language === 'cpp' && (
                <div className="input-container">
                    <label>Provide Input for cin : </label>
                    <textarea
                        rows="5"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder="Enter input for your program (e.g., 5 10)"
                    />
                </div>
            )}

            <div className="output-container">
                <h2>Output:</h2>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;

import React, { useState } from 'react';
import axios from 'axios';

const Text = () => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [streamingResponse, setStreamingResponse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loader visibility


    const handlePromptChange = (e) => {
        setInput(e.target.value);
    };


    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input) return;

        const userMessage = { text: input, role: 'user' }; // Create user message
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setStreamingResponse(''); // Reset the streaming response
        setError(''); // Reset the error
        setLoading(true); // Show loader

        try {
            const result = await axios.post('https://gemini-clone-4n52.onrender.com/chat', {
                messages: [...messages, userMessage],
            });
            setLoading(false); // Hide loader
            setResponse(result.data.response || '');
            displayStreamingResponse(result.data.response);
        } catch (error) {
            setLoading(false); // Hide loader in case of error
            console.error('Error:', error);
            setResponse('Failed to get a response from the server.');
        } finally {
            setLoading(false);
        }
        setInput('');

    };


    const displayStreamingResponse = (fullResponse) => {
        let currentIndex = -1;
        const interval = setInterval(() => {
            if (currentIndex < fullResponse.length) {
                setStreamingResponse((prev) => prev + fullResponse[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval); // Clear the interval when done
            }
        }, 50); // Adjust the speed here (50ms delay between each character)
    };


    return (

        <div className="flex-1 bg-gray-900 text-white p-16">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-white">LLama GenChat Interface</h1>


            <form onSubmit={sendMessage} className="mb-8 w-3/4 m-auto">
                <textarea
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 text-white shadow-lg mb-4 transition duration-300 ease-in-out transform hover:scale-105"
                    value={input}
                    onChange={handlePromptChange}
                    placeholder="Enter your prompt..."
                    rows="2"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    Generate Response
                </button>
            </form>


            {error && (
                <div className="text-red-500 font-semibold mb-4">
                    {error}
                </div>
            )}


            <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-xlv w-3/4 m-auto overflow-y-auto max-h-[calc(70vh-200px)] transition duration-300 ease-in-out transform hover:scale-105">
                {loading ? (
                    <div className="flex items-center justify-center h-full" style={{ flexDirection: "column" }}>
                        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                        <h4 className='mt-6'>Generating Response.....</h4>
                    </div>
                ) : streamingResponse && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center text-white">Response:</h2>
                        <p className="text-md leading-relaxed text-white whitespace-pre-wrap">{streamingResponse}</p>
                    </div>
                )}
            </div>

        </div>

    )

}

export default Text
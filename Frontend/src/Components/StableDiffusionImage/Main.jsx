import React, { useState } from 'react';
import axios from 'axios';

const Main = () => {

    const [prompt, setprompt] = useState("");
    const [image, setimage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loader visibility
    const [isFullscreen, setIsFullscreen] = useState(false); // New state for fullscreen mode


    const handlePromptChange = (e) => {
        setprompt(e.target.value);
    };


    const submit = async (e) => {
        e.preventDefault();
        if (!prompt) return;

        setError(''); // Reset the error
        setLoading(true); // Show loader

        try {
            const response = await axios.post('https://gemini-clone-4n52.onrender.com/image/stablediffusion', { inputs: prompt });
            setimage(response.data.image || '');
            setLoading(false); // Hide loader
        } catch (error) {
            setLoading(false); // Hide loader in case of error
            console.error('Error:', error);
            setError('Failed to get a response from the server.');
        } finally {
            setLoading(false);
            setprompt('');
        }

    };


    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };


    return (

        <div className="flex-1 bg-gray-900 text-white p-16">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-white">Generate Image Using Stable Diffusion</h1>


            <form onSubmit={submit} className="mb-8 w-3/4 m-auto">
                <textarea
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 text-white shadow-lg mb-4 transition duration-300 ease-in-out transform hover:scale-105"
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Enter your prompt to generate image..."
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
                ) : image && (
                    <div className='cursor-pointer' onClick={toggleFullscreen}>
                        <h2 className="text-2xl font-bold mb-4 text-center text-white">Generated Image:</h2>
                        {/* <p className="text-md leading-relaxed text-white whitespace-pre-wrap">{image}</p> */}
                        <img src={image} alt="Generated" className="m-auto rounded-lg shadow-md" />
                    </div>
                )}
            </div>


            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <button className="absolute top-4 right-4 text-white text-2xl font-bold" onClick={toggleFullscreen}>
                        ✕
                    </button>
                    <img src={image} alt="Fullscreen Generated" className="max-w-full max-h-full rounded-lg" />
                </div>
            )}

        </div>

    )

}

export default Main
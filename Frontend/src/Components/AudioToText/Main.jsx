import React, { useState } from 'react';
import axios from 'axios';

const Audio = () => {

    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [streamingResponse, setStreamingResponse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const startRecording = async () => {
        setStreamingResponse('');
        setError('');
        setAudioChunks([]); // Reset audio chunks when starting a new recording

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (event) => {
                console.log('Data available:', event.data.size);
                if (event.data.size > 0) {
                    setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                }
            };
            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setError('Could not access microphone');
        }
    };


    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
            mediaRecorder.onstop = () => {
                sendAudioToBackend();
            };
            setMediaRecorder(null);
        }
    };


    const sendAudioToBackend = async () => {
        setLoading(true);
        setError('');

        if (audioChunks.length === 0) {
            setError("No audio recorded.");
            setLoading(false);
            return; // Exit early if no audio is available
        }

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        console.log('Audio Blob:', audioBlob); // Log the audio blob

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
            const result = await axios.post('http://localhost:8000/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (result.status === 200) {
                console.log('Audio sent successfully:', result.data);
                displayStreamingResponse(result.data.response);
            } else {
                setError("Error generating content");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("The response was blocked due to content safety policies.");
        } finally {
            setLoading(false);
            setAudioChunks([]); // Clear the recorded chunks
        }
    };


    const displayStreamingResponse = (fullResponse) => {
        let currentIndex = -1;
        const interval = setInterval(() => {
            if (currentIndex < fullResponse.length) {
                setStreamingResponse((prev) => prev + fullResponse[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50);
    };


    return (

        <div className="flex-1 bg-gray-900 text-white p-16">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-white">GenAudio Interface</h1>

            <div className="mb-8 w-3/4 m-auto text-center">
                {!recording ? (
                    <button
                        onClick={startRecording}
                        className="py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="py-3 px-6 bg-red-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Stop Recording
                    </button>
                )}
            </div>

            {error && (
                <div className="text-red-500 font-semibold mb-4 text-center">
                    {error}
                </div>
            )}

            <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-xl w-3/4 m-auto overflow-y-auto max-h-[calc(70vh-200px)] transition duration-300 ease-in-out transform hover:scale-105">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : streamingResponse && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center text-white">Transcription:</h2>
                        <p className="text-md leading-relaxed text-white whitespace-pre-wrap">{streamingResponse}</p>
                    </div>
                )}
            </div>
        </div>

    );

};

export default Audio;

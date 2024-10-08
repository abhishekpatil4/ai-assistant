import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Audio } from 'react-loader-spinner';

const AssignTask = ({ user }) => {
    const [task, setTask] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [gettingText, setGettingText] = useState(false);

    const handleAddTask = async () => {
        console.log("Adding task:", task);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assigntask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                task,
                entityId: user.email.split("@")[0]
            }),
        });
        if (response.ok) {
            const result = await response.json();
            console.log('Task added successfully:', result);
        } else {
            const errorResponse = await response.json();
            console.error('Failed to add task:', errorResponse);
        }
    };

    const handleStop = (blobUrl, blob) => {
        console.log("Recording stopped");
        sendAudioToBackend(blob);
    };

    const sendAudioToBackend = async (blob) => {
        console.log("Sending audio...");
        setGettingText(true);
        if (!blob) {
            console.error("No blob provided");
            setGettingText(false);
            return;
        }

        console.log("Blob size:", blob.size);

        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');
        formData.append('entity_id', user.email.split("@")[0]);  // Changed from 'entityId' to 'entity_id'

        // Log the formData contents
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sendaudio`, {
                method: 'POST',
                body: formData,
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                console.log('Audio sent successfully:', responseData);
                setTask(responseData.transcription);  // Changed from 'text' to 'transcription'
            } else {
                console.error('Failed to send audio:', responseData);
                if (responseData.detail && Array.isArray(responseData.detail)) {
                    responseData.detail.forEach(error => {
                        console.error(`Error: ${error.msg}, Location: ${error.loc.join('.')}`);
                    });
                }
                throw new Error('Failed to send audio');
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            // You might want to show an error message to the user here
        } finally {
            setGettingText(false);
        }
    };

    const handleRecordingClick = () => {
        setIsRecording(!isRecording);
    };

    return (
        <div>
            <div className="flex">
                <textarea
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter the task description"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                />
                <button
                    onClick={handleAddTask}
                    className="ml-2 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-4 py-2.5"
                >
                    Add
                </button>
            </div>
            <ReactMediaRecorder
                audio
                onStop={handleStop}
                render={({ startRecording, stopRecording }) => (
                    <div>
                        <button
                            onClick={() => {
                                if (!isRecording) {
                                    startRecording();
                                } else {
                                    stopRecording();
                                }
                                handleRecordingClick();
                            }}
                            type="button"
                            className="mt-4 w-full text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            {gettingText ? (
                                <Audio height="16" width="80" radius="9" color="white" ariaLabel="loading" />
                            ) : (
                                isRecording ? 'Stop recording' : 'Record Audio'
                            )}
                        </button>
                    </div>
                )}
            />
        </div>
    );
}

export default AssignTask;
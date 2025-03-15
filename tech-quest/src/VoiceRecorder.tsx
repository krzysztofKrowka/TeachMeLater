import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const recorderRef:any = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm', // Ważne, aby określić typ MIME
      });

      recorderRef.current = recorder;
      recorder.startRecording();
      setRecording(true);
    } catch (error) {
      console.error('Błąd podczas uruchamiania nagrywania:', error);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const audioBlob = recorderRef.current.getBlob();
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        setRecording(false);
        console.log(audioBlob)
        console.log(audioURL)
        // Prześlij audioBlob do backendu
        uploadAudio(audioBlob);

        // Zatrzymaj strumień
        console.log(recorderRef)//.current).stream.getTracks().forEach((track:any) => track.stop());
      });
    }
  };

  const uploadAudio = async (audioBlob:any) => {
  

// Initialize GoogleGenerativeAI with your API_KEY.
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY as string);

// Initialize a Gemini model appropriate for your use case.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

// Generate content using a prompt and the metadata of the uploaded file.
const result = await model.generateContent([
    {
      fileData: {
        mimeType: "audio/webm",
        fileUri: audioBlob
      }
    },
    { text: "Generate a transcript of the speech." },
  ]);

// Print the response.
console.log(result.response.text())// Pamiętaj o rozszerzeniu
    
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Zatrzymaj nagrywanie' : 'Rozpocznij nagrywanie'}
      </button>
      {audioURL && (
        <audio controls src={audioURL} />
      )}
    </div>
  );
}

export default VoiceRecorder;
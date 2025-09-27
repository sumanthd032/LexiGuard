/**
 * @file AudioPlayer.tsx
 * @description A React component that provides a simple text-to-speech (TTS) player
 * using the browser's built-in Web Speech API. It displays a button to read
 * a given text aloud and to stop the speech.
 */

import React, { useState, useEffect, useRef } from 'react';
import { SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/solid';

/**
 * @interface AudioPlayerProps
 * @description Defines the props for the AudioPlayer component.
 */
interface AudioPlayerProps {
  // The string of text that the component will read aloud.
  textToRead: string;
}

/**
 * A simple UI component that reads provided text aloud using the browser's
 * SpeechSynthesis API. It handles checking for browser support and managing
 * the speaking/stopped state.
 * @param {AudioPlayerProps} props - The props for the component.
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToRead }) => {
  // State to track if the browser is currently speaking.
  const [isSpeaking, setIsSpeaking] = useState(false);
  // State to determine if the TTS engine is available and ready.
  const [canSpeak, setCanSpeak] = useState(false);
  // A ref to hold the current speech utterance instance.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // This effect hook handles the setup and cleanup for the SpeechSynthesis API.
  useEffect(() => {
    const synth = window.speechSynthesis;

    // Function to check if the browser has loaded the available voices.
    const checkVoices = () => {
      if (synth.getVoices().length > 0) {
        setCanSpeak(true);
      }
    };

    // Check immediately and also set up a listener for when voices change.
    checkVoices();
    synth.onvoiceschanged = checkVoices;

    // Cleanup function: runs when the component is unmounted.
    return () => {
      // Remove the event listener to prevent memory leaks.
      synth.onvoiceschanged = null;
      // If the component unmounts while speaking, cancel the speech.
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []); // The empty dependency array ensures this runs only once on mount.

  /**
   * Toggles the speech synthesis on or off.
   */
  const handleToggleSpeech = () => {
    const synth = window.speechSynthesis;

    // If currently speaking, stop the speech.
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } 
    // If not speaking and TTS is available, start the speech.
    else if (canSpeak) {
      // Create a new speech utterance with the provided text.
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance;

      // Event listener for when the speech finishes naturally.
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      // Event listener for any errors during speech.
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };

      // Start speaking.
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleToggleSpeech}
      disabled={!canSpeak} // Disable the button if TTS is not supported.
      title={canSpeak ? "Read analysis aloud" : "Text-to-speech not available"}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-brand-blue bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {/* Conditionally render the icon and text based on the speaking state. */}
      {isSpeaking ? (
        <>
          <StopIcon className="h-5 w-5" />
          <span>Stop Reading</span>
        </>
      ) : (
        <>
          <SpeakerWaveIcon className="h-5 w-5" />
          <span>Read Aloud</span>
        </>
      )}
    </button>
  );
};

export default AudioPlayer;
import React, { useState, useEffect, useRef } from 'react';
import { SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/solid';

interface AudioPlayerProps {
  textToRead: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToRead }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    const checkVoices = () => {
      if (synth.getVoices().length > 0) {
        setCanSpeak(true);
      }
    };

    checkVoices();
    synth.onvoiceschanged = checkVoices;

    return () => {
      synth.onvoiceschanged = null;
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel(); 
      setIsSpeaking(false);
    } else if (canSpeak) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance; 

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };

      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleToggleSpeech}
      disabled={!canSpeak} 
      title={canSpeak ? "Read analysis aloud" : "Text-to-speech not available"}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-brand-blue bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
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
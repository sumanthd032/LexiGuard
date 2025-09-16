import React, { useState, useEffect } from 'react';
import { SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/solid';

interface AudioPlayerProps {
  textToRead: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToRead }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, [synth]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleToggleSpeech}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-brand-blue bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
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
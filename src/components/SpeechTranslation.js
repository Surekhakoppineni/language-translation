import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './SpeechTranslation';


const SpeechTranslation = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('en');
  const [error, setError] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognition = new window.webkitSpeechRecognition();
  const synth = window.speechSynthesis;
  const googleTranslateApiKey = 'dbfe5eb68fmshecd5a7ce3910cfap149795jsna847d957dc2b';

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'fr', name: 'French' },
    { code: 'ta', name: 'Tamil' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ru', name: 'Russian' },
  ];

  useEffect(() => {
    recognition.lang = 'en-US';
  }, []);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setText(transcript);

    // After receiving speech text, trigger translation
    handleTranslation(transcript);
  };

  recognition.onend = () => {
    setRecognizing(false);
  };

  const handleSpeechRecognition = () => {
    setRecognizing(true);
    recognition.start();
  };

  const handleTranslation = async (speechText) => {
    // Use the Google Translate API for text translation
    const requestData = {
      from: fromLanguage,
      to: toLanguage,
      text: speechText,
    };

    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': googleTranslateApiKey,
        'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com',
      },
      data: requestData,
    };

    try {
      const response = await axios.request(options);
      const translatedText = response.data.trans;
      setTranslatedText(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation failed. Please try again.');
    }
  };

  const handleTextToSpeech = () => {
    if (translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = toLanguage;
      synth.speak(utterance);
    }
  };

  return (
    <div className='containers'>
      <div>
        <label>From Language:</label>
        <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To Language:</label>
        <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleSpeechRecognition} disabled={recognizing}>
        {recognizing ? 'Stop Speech Recognition' : 'Start Speech Recognition'}
      </button>
      <p>Speech Text: {text}</p>
      <button className="btn btn-primary" onClick={() => handleTranslation(text)}>Translate Text</button>
      <p>Translated Text: {translatedText}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="btn btn-primary" onClick={handleTextToSpeech} disabled={!translatedText}>
        Text to Speech
      </button>
    </div>
  );
};

export default SpeechTranslation;

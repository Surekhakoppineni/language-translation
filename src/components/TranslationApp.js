import axios from 'axios';
import React, { useState } from 'react';
import './TranslationApp.css';



const TranslationApp = () => {
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('en');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error] = useState('');

  const handleTranslate = async () => {
    const requestData = {
      from: fromLanguage,
      to: toLanguage,
      text: inputText,
    };

    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'dbfe5eb68fmshecd5a7ce3910cfap149795jsna847d957dc2b',
        'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com',
      },
      data: requestData,
    };

    try {
      const response = await axios.request(options);
      setOutputText(response.data.trans);
      console.log(response.data.trans);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
    <div className='containers'>
      <h3 > language Translation </h3>
      <div>
        <label>From Language:</label>
        <input
          type="text"
          value={fromLanguage}
          onChange={(e) => setFromLanguage(e.target.value)}
        />
      </div>
      <div>
        <label>To Language:</label>
        <input
          type="text"
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
        />
      </div>
      <div>
        <label>Text to Translate:</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleTranslate}>Translate</button>
      </div>
      <div>
        <label>Translated Text:</label>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <div>{outputText}</div>
        )}
      </div>
    </div>
  );
};

export default TranslationApp;

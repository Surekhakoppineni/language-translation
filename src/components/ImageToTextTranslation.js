import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

const ImageToTextTranslation = () => {
  const [imageFile, setImageFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('te'); // Default target language is Telugu
  const [error, setError] = useState('');

  useEffect(() => {
    if (extractedText) {
      // If extracted text is available, translate it to the target language
      translateText(extractedText, targetLanguage);
    }
  }, [extractedText, targetLanguage]);

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleTranslateImage = async () => {
    try {
      
      if (!imageFile) {
        setError('Please select an image file.');
        return;
      }

      // Perform OCR using Tesseract.js
      const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'eng', // Default source language is English, as auto-detection might not work in all cases
        { logger: (info) => console.log(info) }
      );

      // Update state with the extracted text and clear any previous error
      setExtractedText(text.trim()); // Remove leading and trailing whitespaces
      setError('');
    } catch (error) {
      // Handle OCR errors
      console.error('Error extracting text from image:', error);
      setError('Error extracting text from image. Please try again.');
    }
  };

  const translateText = async (textToTranslate, targetLanguage) => {
    const requestData = {
      from: 'auto',
      to: targetLanguage,
      text: textToTranslate,
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
      setTranslatedText(response.data.trans.trim()); // Remove leading and trailing whitespaces
      setError('');
    } catch (translationError) {
      
      console.error('Error translating text:', translationError);
      setError('Error translating text.');
    }
  };

  return (
    <div className="containers">
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <button onClick={handleTranslateImage}>Translate Image to Text</button>
      </div>
      <div className="result-container">
        <label>Extracted Text:</label>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          extractedText && <textarea rows={10} cols={50} value={extractedText} readOnly />
        )}
      </div>
      <div className="translation-container">
        <label>Select Target Language:</label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="te">Telugu</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="es">Spanish</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="zh-CN">Chinese (Simplified)</option>
          <option value="jpn">Japanese</option>
          <option value="kor">Korean</option>
          <option value="ta">Tamil</option>
          <option value="hi">Hindi</option>
          
        </select>
        <div>
          <label>Translated Text:</label>
          {translatedText ? (
            <textarea rows={10} cols={50} value={translatedText} readOnly />
          ) : (
            <div style={{ color: 'gray' }}>No text translated</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToTextTranslation;

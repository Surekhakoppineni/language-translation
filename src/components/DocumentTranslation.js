import axios from 'axios';
import React, { useState } from 'react';
import './DocumentTranslation.css';

const DocumentTranslation = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('te');
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtractedText('');
      setOutputText('');
      setError('');

      setLoadingExtract(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setExtractedText(content);
        setLoadingExtract(false);

        translateText(selectedLanguage, selectedFile);
      };
      reader.readAsText(selectedFile);
    }
  };

  const translateText = async (targetLanguage, file) => {
    setLoadingTranslate(true);

    const extractionUrl = 'https://docxtract1.p.rapidapi.com/extract';

    const data = new FormData();
    data.append('file', file);

    const extractionOptions = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': 'c8021116c7mshad3ca54472645f7p16197cjsn1744594698e7',
        'X-RapidAPI-Host': 'docxtract1.p.rapidapi.com',
      },
      body: data,
    };

    try {
      const extractionResponse = await fetch(extractionUrl, extractionOptions);
      const extractionResult = await extractionResponse.text();
      const extractedTextWithNewlines = extractionResult.replace(/\\n/g, '\n');

      setExtractedText(extractedTextWithNewlines);

      // Translate the extracted text
      const translationResult = await translateTextAPI(extractedTextWithNewlines, targetLanguage);
      setOutputText(translationResult);
    } catch (extractionError) {
      console.error(extractionError);
      setError('Error extracting text from the document.');
    } finally {
      setLoadingTranslate(false);
    }
  };

  const translateTextAPI = async (textToTranslate, targetLanguage) => {
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
      return response.data.trans;
    } catch (translationError) {
      console.error(translationError);
      setError('Error translating text.');
      return '';
    }
  };

  const downloadTranslatedTextFile = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'translated_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExtractedTextFile = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'extracted_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const translateOnClick = () => {
    translateText(selectedLanguage, file);
  };

  return (
    <div className="container">
      <div className="flex-container">
        <input type="file" accept=".pdf, .doc, .docx" onChange={onFileChange} />
        <label>Select Target Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="ru">Russian</option>
          <option value="zh-CN">Chinese (Simplified)</option>
        </select>
        <button onClick={translateOnClick} disabled={loadingExtract || loadingTranslate}>
          {loadingExtract ? 'Extracting...' : loadingTranslate ? 'Translating...' : 'Translate'}
        </button>
      </div>
      <div className="result-container">
        <div>
          <label>Extracted Text:</label>
          {extractedText ? (
            <>
              <textarea rows={10} cols={50} value={extractedText} readOnly />
              <button onClick={downloadExtractedTextFile}>Download Extracted Text</button>
            </>
          ) : (
            <div style={{ color: 'gray' }}>No text extracted</div>
          )}
        </div>
        <div>
          <label>Translated Text:</label>
          {outputText ? (
            <>
              <textarea rows={10} cols={50} value={outputText} readOnly />
              <button onClick={downloadTranslatedTextFile}>Download Translated Text</button>
            </>
          ) : (
            <div style={{ color: 'gray' }}>No text translated</div>
          )}
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default DocumentTranslation;

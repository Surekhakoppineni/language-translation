import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import DocumentTranslation from './components/DocumentTranslation';
import ImageToTextTranslation from './components/ImageToTextTranslation';
import SpeechTranslation from './components/SpeechTranslation';
import TranslationApp from './components/TranslationApp';

function App() {
  return (
    <div className="App">
 
      <Navbar/>
      <Routes>
      <Route path="/" element={<TranslationApp/>} />
          <Route path="/SpeechTranslation" element={<SpeechTranslation/>} />
          <Route path="/DocumentTranslation" element={<DocumentTranslation/>} />
          <Route path="/ImageToTextTranslation" element={<ImageToTextTranslation/>} />


      </Routes>


        </div>
  );
}

export default App;

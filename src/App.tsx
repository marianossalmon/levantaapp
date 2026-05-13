import { BrowserRouter, Routes, Route } from 'react-router';
import SurveyList from './screens/SurveyList';
import NewSurvey from './screens/NewSurvey';
import CanvasScreen from './screens/CanvasScreen';
import MediaCapture from './screens/MediaCapture';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SurveyList />} />
        <Route path="/new" element={<NewSurvey />} />
        <Route path="/canvas" element={<CanvasScreen />} />
        <Route path="/media" element={<MediaCapture />} />
      </Routes>
    </BrowserRouter>
  );
}

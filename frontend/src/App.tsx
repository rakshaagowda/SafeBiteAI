import { useState } from 'react';
import { Page } from './types'; // <-- import Page
import Dashboard from './components/Dashboard';
import LogEntry from './components/LogEntry';
import AnalyzeWeek from './components/AnalyzeWeek';
import PredictCause from './components/PredictCause';
import PredictAlertness from './components/PredictAlertness';
import PredictMedical from './components/PredictMedical';

// type Page = 'dashboard' | 'log-entry' | 'analyze-week' | 'predict-cause' | 'predict-alertness' | 'predict-medical';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userId] = useState<string>('123'); // Replace with actual logged-in user ID

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'log-entry' && <LogEntry onNavigate={handleNavigate} userId={userId} />}

      {currentPage === 'analyze-week' && <AnalyzeWeek onNavigate={handleNavigate} userId={userId} />}
      
{currentPage === 'predict-cause' && <PredictCause onNavigate={handleNavigate} userId={userId} />}
      {currentPage === 'predict-alertness' && <PredictAlertness onNavigate={handleNavigate} />}
      {currentPage === 'predict-medical' && <PredictMedical onNavigate={handleNavigate} />}
    </>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import axios from 'axios';
import { FoodLog, Page } from '../types';

interface PredictCauseProps {
  onNavigate: (page: Page) => void;
  userId: string;
}

interface RiskData {
  food: string;
  remedies: { [symptom: string]: { medicines: string[]; homeRemedies: string[] } };
}

export default function PredictCause({ onNavigate, userId }: PredictCauseProps) {
  const [formData, setFormData] = useState({
    symptom: '',
    severity: '5',
    duration: '',
    additionalInfo: ''
  });

  const [result, setResult] = useState<string>('');
  const [lastLog, setLastLog] = useState<FoodLog | null>(null);
  const [latestPrediction, setLatestPrediction] = useState<any | null>(null);
  const [previousRisks, setPreviousRisks] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch last food log from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('foodLogs');
      if (!raw) return;
      const logs: FoodLog[] = JSON.parse(raw);
      if (!Array.isArray(logs) || logs.length === 0) return;
      const last = logs
        .slice()
        .sort((a, b) => +new Date(b.consumedAt) - +new Date(a.consumedAt))[0];
      setLastLog(last);
    } catch {
      // ignore
    }
  }, []);

  // Fetch previous risky foods & remedies from backend (lookback 7 days)
  useEffect(() => {
    const fetchPreviousRisks = async () => {
      try {
        const res = await axios.post(
          'http://localhost:8000/report_symptom/',
          new URLSearchParams({
            user_id: userId,
            symptoms: '', // blank to fetch past data
            lookback: '7'
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const risks = res.data.recent_risky_foods || [];
        const combinedRemedies = res.data.recommendations || [];

        const riskData: RiskData[] = risks.map((food: string, idx: number) => {
          const rawRemedy = combinedRemedies[idx]?.split('. Remedies: ')[1] || '';
          const remediesObj: RiskData['remedies'] = {};

          rawRemedy.split('|').forEach((part: string) => {
            const [symptom, remedyStr] = part.split(':');
            if (symptom && remedyStr) {
              const meds = remedyStr
                .split(',')
                .map(r => r.trim())
                .filter(r => r.toLowerCase().includes('medicine'));
              const homeRemedies = remedyStr
                .split(',')
                .map(r => r.trim())
                .filter(r => !r.toLowerCase().includes('medicine'));
              remediesObj[symptom.trim()] = { medicines: meds, homeRemedies: homeRemedies };
            }
          });

          return { food, remedies: remediesObj };
        });

        setPreviousRisks(riskData);
      } catch (err) {
        console.error('Error fetching previous risks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousRisks();

    // Fetch latest image prediction for this user and show at top
    const fetchLatest = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/predict-cause/latest/${userId}`);
        if (res.data && res.data.latest) {
          setLatestPrediction(res.data.latest);
        }
      } catch (err) {
        // ignore silently; no latest available
      }
    };

    fetchLatest();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptom.trim()) return;

    setResult('Analyzing...');

    try {
      const res = await axios.post(
        'http://localhost:8000/report_symptom/',
        new URLSearchParams({
          user_id: userId,
          symptoms: formData.symptom,
          lookback: '7'
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const riskyFoods = res.data.recent_risky_foods || [];
      const recommendations = res.data.recommendations || [];

      if (riskyFoods.length === 0) {
        setResult('No risky foods detected based on your recent food logs.');
      } else {
        let text = `Potential trigger foods for "${formData.symptom}":\n\n`;
        riskyFoods.forEach((food: string, idx: number) => {
          text += `• ${food}\n`;
          const rawRemedy = recommendations[idx]?.split('. Remedies: ')[1] || '';
          rawRemedy.split('|').forEach((part: string) => {
            const [symptom, remedyStr] = part.split(':');
            if (symptom && remedyStr) {
              const meds = remedyStr
                .split(',')
                .map(r => r.trim())
                .filter(r => r.toLowerCase().includes('medicine'));
              const homeRemedies = remedyStr
                .split(',')
                .map(r => r.trim())
                .filter(r => !r.toLowerCase().includes('medicine'));
              if (meds.length > 0) text += `    • Medicines: ${meds.join(', ')}\n`;
              if (homeRemedies.length > 0) text += `    • Home Remedies: ${homeRemedies.join(', ')}\n`;
            }
          });
          text += '\n';
        });
        setResult(text.trim());
      }
    } catch (err) {
      console.error(err);
      setResult('Error fetching analysis from server.');
    }
  };

  const analyzeFromLastLog = () => {
    if (!lastLog) return;
    setResult(
      `Analyzing last logged food:\n- Food: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType})\n- Time: ${new Date(
        lastLog.consumedAt
      ).toLocaleString()}\n${lastLog.notes ? `- Notes: ${lastLog.notes}` : ''}\n\nSubmit a symptom above to see potential triggers.`
    );
  };

  if (loading) return <div className="text-center mt-20">Loading previous risks...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Cause</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Latest prediction card (if available) */}
            {latestPrediction && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-2">Latest Image Prediction</h3>
                <p className="text-sm text-slate-700">
                  Food: <strong>{latestPrediction.food}</strong>
                </p>
                <p className="text-sm text-slate-700">
                  Time: <strong>{new Date(latestPrediction.timestamp).toLocaleString()}</strong>
                </p>
                {latestPrediction.sickness_info && (
                  <div className="mt-2 text-sm text-slate-700">
                    <p>
                      Risk: <strong>{latestPrediction.sickness_info.status}</strong>
                    </p>
                    <p>
                      Risk score: <strong>{latestPrediction.sickness_info.risk_score}</strong>
                    </p>
                  </div>
                )}
                {latestPrediction.allergy_alert && (
                  <div className="mt-2 text-sm text-slate-700">
                    <p>
                      Allergy: <strong>{latestPrediction.allergy_alert.status}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Identify Food Triggers</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Symptom Description</label>
                <input
                  type="text"
                  required
                  value={formData.symptom}
                  onChange={e => setFormData(prev => ({ ...prev, symptom: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="e.g., Headache, nausea..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Severity Level (1-10)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.severity}
                    onChange={e => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <span className="text-2xl font-bold text-orange-600 w-12 text-center">{formData.severity}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="e.g., 2 hours, all day..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Information</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={e => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Any other relevant details..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                Analyze Potential Causes
              </button>

              <button
                type="button"
                onClick={analyzeFromLastLog}
                className="w-full mt-3 bg-white border border-orange-300 text-orange-700 font-semibold py-3 rounded-lg hover:bg-orange-50 transition-all"
              >
                Analyze From Last Log
              </button>
            </form>

            {result && (
              <div className="mt-8 p-6 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Analysis Results</h3>
                <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
              </div>
            )}

            {previousRisks.length > 0 && (
              <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Past High-Risk Foods & Remedies</h3>
                {previousRisks.map((risk, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="font-semibold text-slate-700">{risk.food}</p>
                    {Object.entries(risk.remedies).map(([symptom, r], i) => (
                      <div key={i} className="text-sm text-slate-600 ml-2">
                        <p>{symptom}:</p>
                        {r.medicines.length > 0 && <p className="ml-4">• Medicines: {r.medicines.join(', ')}</p>}
                        {r.homeRemedies.length > 0 && <p className="ml-4">• Home Remedies: {r.homeRemedies.join(', ')}</p>}
                        {r.medicines.length === 0 && r.homeRemedies.length === 0 && <p className="ml-4">• No remedies</p>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

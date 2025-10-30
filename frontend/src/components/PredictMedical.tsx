import { useEffect, useState } from 'react';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import axios from 'axios';
import { FoodLog, Page } from '../types';

interface PredictMedicalProps {
  onNavigate: (page: Page) => void;
}

interface BackendResponse {
  recent_risky_foods: string[];
  recommendations: string[];
  symptoms: string[];
}

export default function PredictMedical({ onNavigate }: PredictMedicalProps) {
  const [userId, setUserId] = useState('user123');
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    frequency: '',
    medicalHistory: '',
    currentMedications: '',
    dietaryRestrictions: ''
  });
  const [allergies, setAllergiesInput] = useState('');
  const [result, setResult] = useState<string>('');
  const [lastLog, setLastLog] = useState<FoodLog | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch last log from backend
  useEffect(() => {
    const fetchLastLog = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/predict-cause/latest/${userId}`);
        if (res.data.latest) setLastLog(res.data.latest);
      } catch (err) {
        console.error('Error fetching last log:', err);
      }
    };
    fetchLastLog();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptoms.trim()) {
      alert('Please enter your symptoms.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      // Store allergies if provided
      if (allergies.trim()) {
        const allergyArray = allergies.split(',').map(a => a.trim()).filter(a => a);
        await axios.post(
          'http://localhost:8000/set_allergies/',
          new URLSearchParams({
            user_id: userId,
            allergies: allergyArray.join(',')
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
      }

      // Request backend for 7-day analysis
      const res = await axios.post<BackendResponse>(
        'http://localhost:8000/report_symptom/',
        new URLSearchParams({
          user_id: userId,
          symptoms: formData.symptoms,
          lookback: '7'
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { recent_risky_foods, recommendations } = res.data;

      let analysis = `🩺 Medical Assessment Summary\n\n`;
      analysis += `Symptoms Reported: ${formData.symptoms}\n`;
      analysis += `Duration: ${formData.duration || 'Not specified'}\n`;
      analysis += `Frequency: ${formData.frequency || 'Not specified'}\n`;
      analysis += `Medical History: ${formData.medicalHistory || 'Not specified'}\n`;
      analysis += `Medications: ${formData.currentMedications || 'None'}\n`;
      analysis += `Dietary Restrictions: ${formData.dietaryRestrictions || 'None'}\n`;

      if (lastLog) {
        analysis += `\nRecent Food Log:\n• ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType}) at ${new Date(lastLog.consumedAt).toLocaleString()}\n`;
        if (lastLog.notes) analysis += `  Notes: ${lastLog.notes}\n`;
      }

      if (recent_risky_foods.length > 0) {
        analysis += `\n⚠️ Potential Trigger Foods (Past 7 Days):\n`;
        recent_risky_foods.forEach((food, idx) => {
          analysis += `• ${food}\n`;
          const remedy = recommendations[idx];
          if (remedy) analysis += `  Remedies / Advice: ${remedy}\n`;
        });
      } else {
        analysis += `\n✅ No high-risk foods detected in the last 7 days.`;
      }

      analysis += `\n\n💡 Insights:\n• Track your meals and symptoms daily for patterns.\n• Avoid or limit foods listed as potential triggers.\n• Consult your healthcare provider for allergy testing.\n\nDisclaimer: This tool does not replace professional medical advice.`;

      setResult(analysis);
    } catch (err: any) {
      console.error('Error analyzing medical data:', err);
      setResult('⚠️ Error analyzing last 7 days data. Ensure backend is running and user has recent uploads.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeFromLastLog = () => {
    if (!lastLog) {
      setResult('No recent logs found to analyze.');
      return;
    }
    let analysis = `🩺 Medical Assessment (Based on Last Log)\n\n`;
    analysis += `Recent Food: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType})\nConsumed At: ${new Date(lastLog.consumedAt).toLocaleString()}\n`;
    if (lastLog.notes) analysis += `Notes: ${lastLog.notes}\n`;
    analysis += `\nInsights:\n• Watch for symptoms within 6 hours of this meal.\n• Log reactions promptly for better predictions.\n• Avoid suspected ingredients if symptoms repeat.\n\nDisclaimer: Not a diagnosis.`;
    setResult(analysis);
  };

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

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Medical Insights</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
              <textarea
                required
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={3}
                placeholder="Describe your symptoms..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Duration (e.g., 2 days)"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="text"
                placeholder="Frequency (e.g., 3 times/day)"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <input
              type="text"
              placeholder="Allergies (comma-separated)"
              value={allergies}
              onChange={(e) => setAllergiesInput(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />

            <textarea
              placeholder="Medical History"
              value={formData.medicalHistory}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={2}
            />

            <input
              type="text"
              placeholder="Current Medications"
              value={formData.currentMedications}
              onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />

            <input
              type="text"
              placeholder="Dietary Restrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all"
            >
              {loading ? 'Analyzing...' : 'Generate Medical Insights'}
            </button>

            <button
              type="button"
              onClick={analyzeFromLastLog}
              className="w-full mt-3 bg-white border border-cyan-300 text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all"
            >
              Analyze From Last Log
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
              <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

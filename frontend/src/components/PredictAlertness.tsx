import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { Page } from '../types';

interface PredictAlertnessProps {
  // onNavigate: (page: string) => void;
  onNavigate: (page: Page) => void;
}

export default function PredictAlertness({ onNavigate }: PredictAlertnessProps) {
  const [userId, setUserId] = useState("user123");
  const [formData, setFormData] = useState({
    sleepHours: "",
    mealTiming: "",
    caffeineIntake: "",
    currentAlertness: "5",
    activityLevel: "moderate",
    stressLevel: "5",
  });

  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      // Call backend /predict_alertness/ endpoint
      const form = new FormData();
      form.append("user_id", userId);
      form.append("sleep_hours", formData.sleepHours);
      form.append("meal_timing", formData.mealTiming);
      form.append("caffeine_intake", formData.caffeineIntake);
      form.append("current_alertness", formData.currentAlertness);
      form.append("activity_level", formData.activityLevel);
      form.append("stress_level", formData.stressLevel);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/predict_alertness/",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error(error);
      setResult("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Alertness</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Sleep Hours */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sleep Hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sleepHours: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="e.g., 7.5"
                />
              </div>

              {/* Meal Timing */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meal Timing</label>
                <input
                  type="text"
                  value={formData.mealTiming}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mealTiming: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="e.g., Breakfast at 8 AM"
                />
              </div>

              {/* Caffeine Intake */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Caffeine Intake</label>
                <input
                  type="text"
                  value={formData.caffeineIntake}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caffeineIntake: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="e.g., 2 cups coffee"
                />
              </div>

              {/* Current Alertness */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Alertness (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.currentAlertness}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentAlertness: e.target.value }))}
                  className="w-full"
                />
                <span className="text-slate-700 font-medium">{formData.currentAlertness}</span>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, activityLevel: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Stress Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stress Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stressLevel: e.target.value }))}
                  className="w-full"
                />
                <span className="text-slate-700 font-medium">{formData.stressLevel}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? "Predicting..." : "Predict Alertness"}
              </button>
            </form>

            {result && (
              <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-3 text-lg">Alertness Prediction</h3>
                <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

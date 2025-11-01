// import { useState } from 'react';
// import { ArrowLeft, AlertCircle } from 'lucide-react';

// interface PredictAlertnessProps {
//   onNavigate: (page: string) => void;
// }

// export default function PredictAlertness({ onNavigate }: PredictAlertnessProps) {
//   const [formData, setFormData] = useState({
//     sleepHours: '',
//     mealTiming: '',
//     caffeineIntake: '',
//     currentAlertness: '5',
//     activityLevel: 'moderate',
//     stressLevel: '5'
//   });

//   const [result, setResult] = useState<string>('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const alertnessScore = parseInt(formData.currentAlertness);
//     const sleepHours = parseFloat(formData.sleepHours);

//     let prediction = '';
//     if (alertnessScore >= 7 && sleepHours >= 7) {
//       prediction = 'Excellent alertness expected';
//     } else if (alertnessScore >= 5 || sleepHours >= 6) {
//       prediction = 'Moderate alertness - consider optimizing meal timing';
//     } else {
//       prediction = 'Low alertness predicted - prioritize rest and nutrition';
//     }

//     const analysis = `Alertness Analysis:
// - Current Level: ${formData.currentAlertness}/10
// - Sleep Duration: ${formData.sleepHours} hours
// - Caffeine Intake: ${formData.caffeineIntake}
// - Activity Level: ${formData.activityLevel}
// - Stress Level: ${formData.stressLevel}/10

// Prediction: ${prediction}

// Recommendations:
// • Maintain consistent meal times for stable energy
// • Aim for 7-9 hours of quality sleep
// • Consider protein-rich meals for sustained alertness
// • Stay hydrated throughout the day
// • Avoid heavy meals that may cause drowsiness`;

//     setResult(analysis);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="container mx-auto px-4 py-8">
//         <button
//           onClick={() => onNavigate('dashboard')}
//           className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span className="font-medium">Back to Dashboard</span>
//         </button>

//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Alertness</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
//                 <AlertCircle className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800">Analyze Alertness Patterns</h2>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Sleep Duration (hours)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.5"
//                   required
//                   value={formData.sleepHours}
//                   onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 7.5"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Last Meal Timing
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.mealTiming}
//                   onChange={(e) => setFormData(prev => ({ ...prev, mealTiming: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 hours ago, 30 minutes ago..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Caffeine Intake Today
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.caffeineIntake}
//                   onChange={(e) => setFormData(prev => ({ ...prev, caffeineIntake: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 cups of coffee, 1 energy drink..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Current Alertness Level (1-10)
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <input
//                     type="range"
//                     min="1"
//                     max="10"
//                     value={formData.currentAlertness}
//                     onChange={(e) => setFormData(prev => ({ ...prev, currentAlertness: e.target.value }))}
//                     className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
//                   />
//                   <span className="text-2xl font-bold text-red-600 w-12 text-center">
//                     {formData.currentAlertness}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Activity Level
//                 </label>
//                 <select
//                   value={formData.activityLevel}
//                   onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                 >
//                   <option value="sedentary">Sedentary</option>
//                   <option value="light">Light Activity</option>
//                   <option value="moderate">Moderate Activity</option>
//                   <option value="active">Very Active</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Stress Level (1-10)
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <input
//                     type="range"
//                     min="1"
//                     max="10"
//                     value={formData.stressLevel}
//                     onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: e.target.value }))}
//                     className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
//                   />
//                   <span className="text-2xl font-bold text-red-600 w-12 text-center">
//                     {formData.stressLevel}
//                   </span>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
//               >
//                 Predict Alertness
//               </button>
//             </form>

//             {result && (
//               <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Alertness Prediction</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//after integrating with backend and model

// import { useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import api from '../api'; // ✅ Default import from your api/index.ts

// interface PredictAlertnessProps {
//   onNavigate: (page: string) => void;
// }

// export default function PredictAlertness({ onNavigate }: PredictAlertnessProps) {
//   const [formData, setFormData] = useState({
//     sleepHours: '',
//     mealTiming: '',
//     caffeineIntake: '',
//     currentAlertness: '5',
//     activityLevel: 'moderate',
//     stressLevel: '5'
//   });

//   const [result, setResult] = useState<string>('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await api.predictAlertness({
//         sleep_hours: parseFloat(formData.sleepHours),
//         meal_timing: formData.mealTiming,
//         caffeine_intake: formData.caffeineIntake,
//         current_alertness: parseInt(formData.currentAlertness),
//         activity_level: formData.activityLevel,
//         stress_level: parseInt(formData.stressLevel)
//       });

//       const analysis = `Prediction: ${response.prediction}\n\nRecommendations:\n• ${response.recommendations.join(
//         '\n• '
//       )}`;
//       setResult(analysis);
//     } catch (error) {
//       console.error(error);
//       setResult('Failed to get prediction. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="container mx-auto px-4 py-8">
//         <button
//           onClick={() => onNavigate('dashboard')}
//           className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span className="font-medium">Back to Dashboard</span>
//         </button>

//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Alertness</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Sleep Hours */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Sleep Hours
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.1"
//                   required
//                   value={formData.sleepHours}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, sleepHours: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 7.5"
//                 />
//               </div>

//               {/* Meal Timing */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Meal Timing
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.mealTiming}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, mealTiming: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., Breakfast at 8 AM"
//                 />
//               </div>

//               {/* Caffeine Intake */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Caffeine Intake
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.caffeineIntake}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, caffeineIntake: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 cups coffee"
//                 />
//               </div>

//               {/* Current Alertness */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Current Alertness (1-10)
//                 </label>
//                 <input
//                   type="range"
//                   min="1"
//                   max="10"
//                   value={formData.currentAlertness}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, currentAlertness: e.target.value }))
//                   }
//                   className="w-full"
//                 />
//                 <span className="text-slate-700 font-medium">{formData.currentAlertness}</span>
//               </div>

//               {/* Activity Level */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Activity Level
//                 </label>
//                 <select
//                   value={formData.activityLevel}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, activityLevel: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                 >
//                   <option value="low">Low</option>
//                   <option value="moderate">Moderate</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>

//               {/* Stress Level */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Stress Level (1-10)
//                 </label>
//                 <input
//                   type="range"
//                   min="1"
//                   max="10"
//                   value={formData.stressLevel}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, stressLevel: e.target.value }))
//                   }
//                   className="w-full"
//                 />
//                 <span className="text-slate-700 font-medium">{formData.stressLevel}</span>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
//               >
//                 {loading ? 'Predicting...' : 'Predict Alertness'}
//               </button>
//             </form>

//             {result && (
//               <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Alertness Prediction</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//integration2
// frontend/src/components/PredictAlertness.tsx mock endpoint
// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { reportSymptoms } from "../api"; // ✅ use existing API methods

// interface PredictAlertnessProps {
//   onNavigate: (page: string) => void;
// }

// export default function PredictAlertness({ onNavigate }: PredictAlertnessProps) {
//   const [userId, setUserId] = useState("user123");
//   const [formData, setFormData] = useState({
//     sleepHours: "",
//     mealTiming: "",
//     caffeineIntake: "",
//     currentAlertness: "5",
//     activityLevel: "moderate",
//     stressLevel: "5",
//   });

//   const [result, setResult] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setResult("");

//     try {
//       // Since we don't have a dedicated predictAlertness endpoint,
//       // we can reuse reportSymptoms for demonstration
//       const symptomRes = await reportSymptoms(
//         userId,
//         `Sleep Hours: ${formData.sleepHours}, Meal Timing: ${formData.mealTiming}, Caffeine Intake: ${formData.caffeineIntake}, Alertness: ${formData.currentAlertness}, Activity: ${formData.activityLevel}, Stress: ${formData.stressLevel}`
//       );

//       const analysis = `Alertness Prediction (mocked via symptoms API):\n\n${JSON.stringify(
//         symptomRes,
//         null,
//         2
//       )}`;
//       setResult(analysis);
//     } catch (error: any) {
//       console.error(error);
//       setResult("Failed to get prediction. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="container mx-auto px-4 py-8">
//         <button
//           onClick={() => onNavigate("dashboard")}
//           className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span className="font-medium">Back to Dashboard</span>
//         </button>

//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Alertness</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* User ID */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   User ID
//                 </label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               {/* Sleep Hours */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Sleep Hours
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.1"
//                   value={formData.sleepHours}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, sleepHours: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 7.5"
//                 />
//               </div>

//               {/* Meal Timing */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Meal Timing
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.mealTiming}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, mealTiming: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., Breakfast at 8 AM"
//                 />
//               </div>

//               {/* Caffeine Intake */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Caffeine Intake
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.caffeineIntake}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, caffeineIntake: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 cups coffee"
//                 />
//               </div>

//               {/* Current Alertness */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Current Alertness (1-10)
//                 </label>
//                 <input
//                   type="range"
//                   min="1"
//                   max="10"
//                   value={formData.currentAlertness}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, currentAlertness: e.target.value }))
//                   }
//                   className="w-full"
//                 />
//                 <span className="text-slate-700 font-medium">{formData.currentAlertness}</span>
//               </div>

//               {/* Activity Level */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Activity Level
//                 </label>
//                 <select
//                   value={formData.activityLevel}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, activityLevel: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                 >
//                   <option value="low">Low</option>
//                   <option value="moderate">Moderate</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>

//               {/* Stress Level */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Stress Level (1-10)
//                 </label>
//                 <input
//                   type="range"
//                   min="1"
//                   max="10"
//                   value={formData.stressLevel}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, stressLevel: e.target.value }))
//                   }
//                   className="w-full"
//                 />
//                 <span className="text-slate-700 font-medium">{formData.stressLevel}</span>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
//               >
//                 {loading ? "Predicting..." : "Predict Alertness"}
//               </button>
//             </form>

//             {result && (
//               <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Alertness Prediction</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//integration 3
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

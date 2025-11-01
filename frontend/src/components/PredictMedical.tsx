
// //after integrating with FASTAPI
// // frontend/src/components/PredictMedical.tsx
// import { useState } from "react";
// import { ArrowLeft, Stethoscope } from "lucide-react";
// import { uploadFoodImage, reportSymptoms } from "../api"; // ✅ relative import

// interface PredictMedicalProps {
//   onNavigate: (page: string) => void;
// }

// export default function PredictMedical({ onNavigate }: PredictMedicalProps) {
//   const [userId, setUserId] = useState("user123");
//   const [formData, setFormData] = useState({
//     symptoms: "",
//     duration: "",
//     frequency: "",
//     medicalHistory: "",
//     currentMedications: "",
//     dietaryRestrictions: "",
//   });

//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.symptoms.trim()) {
//       alert("Please describe your symptoms before submitting.");
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       // Step 1: Report symptoms to backend
//       const symptomRes = await reportSymptoms(userId, formData.symptoms);

//       // Step 2: Upload food image if provided
//       let foodRes = null;
//       if (file) {
//         foodRes = await uploadFoodImage(userId, file, formData.symptoms);
//       }

//       // Combine results
//       setResult({
//         symptomAnalysis: symptomRes,
//         foodAnalysis: foodRes,
//       });
//     } catch (error: any) {
//       console.error("❌ Prediction error:", error);
//       alert(error?.detail || "An error occurred while analyzing data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Back Button */}
//         <button
//           onClick={() => onNavigate("dashboard")}
//           className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span className="font-medium">Back to Dashboard</span>
//         </button>

//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Medical</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             {/* Header */}
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
//                 <Stethoscope className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800">Medical Insights</h2>
//             </div>

//             {/* Info Box */}
//             <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
//               <p className="text-sm text-yellow-800 font-medium">
//                 ⚠️ This tool provides general information only. Always consult healthcare professionals.
//               </p>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* User ID */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               {/* Symptoms */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
//                 <textarea
//                   required
//                   value={formData.symptoms}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, symptoms: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
//                   rows={3}
//                   placeholder="Describe your symptoms..."
//                 />
//               </div>

//               {/* Duration */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
//                 <input
//                   type="text"
//                   value={formData.duration}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                   placeholder="e.g., 2 weeks"
//                 />
//               </div>

//               {/* Frequency */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency</label>
//                 <input
//                   type="text"
//                   value={formData.frequency}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, frequency: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                   placeholder="e.g., Daily, after meals..."
//                 />
//               </div>

//               {/* Food Image */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Food Image (optional)</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg"
//                 />
//               </div>

//               {/* Medical History */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Medical History</label>
//                 <textarea
//                   value={formData.medicalHistory}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, medicalHistory: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
//                   rows={2}
//                   placeholder="Previous diagnoses, allergies, family history..."
//                 />
//               </div>

//               {/* Current Medications */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications</label>
//                 <input
//                   type="text"
//                   value={formData.currentMedications}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, currentMedications: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                   placeholder="List your current medications..."
//                 />
//               </div>

//               {/* Dietary Restrictions */}
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Restrictions or Allergies</label>
//                 <input
//                   type="text"
//                   value={formData.dietaryRestrictions}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, dietaryRestrictions: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                   placeholder="e.g., lactose intolerant, nut allergy..."
//                 />
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
//               >
//                 {loading ? "Analyzing..." : "Generate Medical Insights"}
//               </button>
//             </form>

//             {/* Result */}
//             {result && (
//               <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Medical Assessment</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans text-sm">
//                   {JSON.stringify(result, null, 2)}
//                 </pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// frontend/src/components/PredictMedical.tsx hardcoded
// import { useEffect, useState } from 'react';
// import { ArrowLeft, Stethoscope } from 'lucide-react';
// import { reportSymptoms, setAllergies } from '../api';
// import { FoodLog } from '../types';
// import { Page } from '../types';

// interface PredictMedicalProps {
//     onNavigate: (page: Page) => void;
// }

// export default function PredictMedical({ onNavigate }: PredictMedicalProps) {
//   const [userId, setUserId] = useState('user123');
//   const [formData, setFormData] = useState({
//     symptoms: '',
//     duration: '',
//     frequency: '',
//     medicalHistory: '',
//     currentMedications: '',
//     dietaryRestrictions: ''
//   });

//   const [allergies, setAllergiesInput] = useState('');
//   const [result, setResult] = useState<string>('');
//   const [lastLog, setLastLog] = useState<FoodLog | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem('foodLogs');
//       if (!raw) return;
//       const logs: FoodLog[] = JSON.parse(raw);
//       if (!Array.isArray(logs) || logs.length === 0) return;
//       const last = logs.slice().sort((a, b) => +new Date(b.consumedAt) - +new Date(a.consumedAt))[0];
//       setLastLog(last);
//     } catch {
//       // ignore
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.symptoms.trim()) {
//       alert('Please enter your symptoms.');
//       return;
//     }

//     setLoading(true);
//     setResult('');

//     try {
//       // Report symptoms
//       const symptomRes = await reportSymptoms(userId, formData.symptoms);

//       // Set allergies if any
//       if (allergies.trim()) {
//         const allergyArray = allergies.split(',').map(a => a.trim()).filter(a => a);
//         await setAllergies(userId, allergyArray);
//       }

//       // Combine analysis with last log info
//       const inferredLine = lastLog
//         ? `\nRecent food log: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType}) at ${new Date(lastLog.consumedAt).toLocaleString()}${lastLog.notes ? `\nNotes: ${lastLog.notes}` : ''}`
//         : '';

//       const analysis = `Medical Assessment Summary:

// Symptoms Reported: ${formData.symptoms}
// Duration: ${formData.duration || 'Not specified'}
// Frequency: ${formData.frequency || 'Not specified'}
// Medical History: ${formData.medicalHistory || 'Not specified'}
// Current Medications: ${formData.currentMedications || 'None reported'}
// Dietary Restrictions: ${formData.dietaryRestrictions || 'None reported'}
// ${inferredLine}

// Preliminary Insights:
// • Based on your symptoms, consider consulting with a healthcare provider
// • Track symptom patterns in relation to specific foods
// • Keep a detailed log for your medical appointments
// • Consider allergy testing if symptoms are consistent

// IMPORTANT DISCLAIMER:
// This is NOT a medical diagnosis. Please consult qualified healthcare professionals for:
// - Persistent or severe symptoms
// - Sudden changes in health
// - Any concerns about food allergies or intolerances
// - Personalized medical advice

// Recommended Actions:
// 1. Schedule an appointment with your primary care physician
// 2. Continue logging food intake and symptoms
// 3. Share this information with your healthcare provider
// 4. Consider consulting an allergist or nutritionist`;

//       setResult(analysis);
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.detail || 'Error analyzing data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeFromLastLog = () => {
//     if (!lastLog) return;
//     const info = `Recent food log: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType}) at ${new Date(lastLog.consumedAt).toLocaleString()}${lastLog.notes ? `\nNotes: ${lastLog.notes}` : ''}`;
//     const analysis = `Medical Assessment (from last log)\n\n${info}\n\nPreliminary Insights:\n• Monitor any symptoms within 2-6 hours post meal\n• If symptoms recur, consider specific intolerance testing\n• Keep logging to correlate foods and reactions\n\nDisclaimer: Not a diagnosis. Consult licensed professionals for medical advice.`;
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
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Medical</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
//                 <Stethoscope className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800">Medical Insights</h2>
//             </div>

//             <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
//               <p className="text-sm text-yellow-800 font-medium">
//                 This tool provides general information only. Always consult healthcare professionals for medical advice.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
//                 <textarea
//                   required
//                   value={formData.symptoms}
//                   onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
//                   rows={3}
//                   placeholder="Describe your symptoms in detail..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Duration of Symptoms</label>
//                 <input
//                   type="text"
//                   value={formData.duration}
//                   onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 weeks, 3 days..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency of Occurrence</label>
//                 <input
//                   type="text"
//                   value={formData.frequency}
//                   onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., Daily, 2-3 times per week..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies (comma-separated)</label>
//                 <input
//                   type="text"
//                   value={allergies}
//                   onChange={(e) => setAllergiesInput(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., lactose, peanuts"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Medical History</label>
//                 <textarea
//                   value={formData.medicalHistory}
//                   onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
//                   rows={2}
//                   placeholder="Previous diagnoses, allergies, family history..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications</label>
//                 <input
//                   type="text"
//                   value={formData.currentMedications}
//                   onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="List any medications you're currently taking..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Restrictions</label>
//                 <input
//                   type="text"
//                   value={formData.dietaryRestrictions}
//                   onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., lactose intolerant, nut allergy..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
//               >
//                 {loading ? 'Analyzing...' : 'Generate Medical Insights'}
//               </button>

//               <button
//                 type="button"
//                 onClick={analyzeFromLastLog}
//                 className="w-full mt-3 bg-white border border-cyan-300 text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all"
//               >
//                 Analyze From Last Log
//               </button>
//             </form>

//             {result && (
//               <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Medical Assessment</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



//without remedies
// import { useEffect, useState } from 'react';
// import { ArrowLeft, Stethoscope } from 'lucide-react';
// import axios from 'axios';
// import { FoodLog, Page } from '../types';

// interface PredictMedicalProps {
//   onNavigate: (page: Page) => void;
// }

// export default function PredictMedical({ onNavigate }: PredictMedicalProps) {
//   const [userId, setUserId] = useState('user123');
//   const [formData, setFormData] = useState({
//     symptoms: '',
//     duration: '',
//     frequency: '',
//     medicalHistory: '',
//     currentMedications: '',
//     dietaryRestrictions: ''
//   });
//   const [allergies, setAllergiesInput] = useState('');
//   const [lastLog, setLastLog] = useState<FoodLog | null>(null);
//   const [result, setResult] = useState<string>('');
//   const [loading, setLoading] = useState(false);

//   // Load last food log
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem('foodLogs');
//       if (!raw) return;
//       const logs: FoodLog[] = JSON.parse(raw);
//       if (!Array.isArray(logs) || logs.length === 0) return;
//       const last = logs.slice().sort((a, b) => +new Date(b.consumedAt) - +new Date(a.consumedAt))[0];
//       setLastLog(last);
//     } catch {
//       // ignore
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.symptoms.trim()) {
//       alert('Please enter your symptoms.');
//       return;
//     }

//     setLoading(true);
//     setResult('');

//     try {
//       // 1️⃣ Report symptoms to backend
//       const symptomRes = await axios.post(
//         'http://localhost:8000/report_symptom/',
//         new URLSearchParams({
//           user_id: userId,
//           symptoms: formData.symptoms,
//           lookback: '5'
//         }),
//         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//       );

//       // 2️⃣ Set allergies if entered
//       if (allergies.trim()) {
//         const allergyArray = allergies.split(',').map(a => a.trim()).filter(a => a);
//         await axios.post(
//           'http://localhost:8000/set_allergies/',
//           new URLSearchParams({
//             user_id: userId,
//             allergies: allergyArray.join(',')
//           }),
//           { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//         );
//       }

//       // 3️⃣ Compose result using backend response
//       const riskyFoods = symptomRes.data.recent_risky_foods || [];
//       const recommendations: string[] = symptomRes.data.recommendations || [];

//       const lastLogInfo = lastLog
//         ? `\nRecent Food Log:\n- Food: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType})\n- Time: ${new Date(lastLog.consumedAt).toLocaleString()}\n${lastLog.notes ? `- Notes: ${lastLog.notes}` : ''}`
//         : '';

//       let analysis = `Medical Assessment Summary:

// Symptoms Reported: ${formData.symptoms}
// Duration: ${formData.duration || 'Not specified'}
// Frequency: ${formData.frequency || 'Not specified'}
// Medical History: ${formData.medicalHistory || 'Not specified'}
// Current Medications: ${formData.currentMedications || 'None reported'}
// Dietary Restrictions: ${formData.dietaryRestrictions || 'None reported'}
// Allergies: ${allergies || 'None reported'}${lastLogInfo}

// `;

//       if (riskyFoods.length === 0) {
//         analysis += '✅ No high-risk foods detected based on recent logs.\n';
//       } else {
//         analysis += '⚠️ Potential Trigger Foods Detected:\n';
//         riskyFoods.forEach((food: string, idx: number) => {
//           analysis += `• ${food}\n  Recommendation: ${recommendations[idx] || 'Avoid this food.'}\n`;
//         });
//       }

//       analysis += `\n⚠️ IMPORTANT DISCLAIMER:
// This is NOT a medical diagnosis. Please consult qualified healthcare professionals for:
// - Persistent or severe symptoms
// - Sudden changes in health
// - Any concerns about food allergies or intolerances
// - Personalized medical advice`;

//       setResult(analysis);
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.response?.data?.error || 'Error analyzing data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeFromLastLog = () => {
//     if (!lastLog) return;
//     const info = `Recent Food Log:\n- Food: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType})\n- Time: ${new Date(lastLog.consumedAt).toLocaleString()}\n${lastLog.notes ? `- Notes: ${lastLog.notes}` : ''}`;
//     setResult(`Medical Assessment (from last log)\n\n${info}\n\n⚠️ Disclaimer: Not a diagnosis. Consult licensed professionals for medical advice.`);
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
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Medical</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
//                 <Stethoscope className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800">Medical Insights</h2>
//             </div>

//             <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
//               <p className="text-sm text-yellow-800 font-medium">
//                 This tool provides general information only. Always consult healthcare professionals for medical advice.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
//                 <textarea
//                   required
//                   value={formData.symptoms}
//                   onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
//                   rows={3}
//                   placeholder="Describe your symptoms in detail..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Duration of Symptoms</label>
//                 <input
//                   type="text"
//                   value={formData.duration}
//                   onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 weeks, 3 days..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency of Occurrence</label>
//                 <input
//                   type="text"
//                   value={formData.frequency}
//                   onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., Daily, 2-3 times per week..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies (comma-separated)</label>
//                 <input
//                   type="text"
//                   value={allergies}
//                   onChange={(e) => setAllergiesInput(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., lactose, peanuts"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Medical History</label>
//                 <textarea
//                   value={formData.medicalHistory}
//                   onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
//                   rows={2}
//                   placeholder="Previous diagnoses, allergies, family history..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications</label>
//                 <input
//                   type="text"
//                   value={formData.currentMedications}
//                   onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="List any medications you're currently taking..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Restrictions</label>
//                 <input
//                   type="text"
//                   value={formData.dietaryRestrictions}
//                   onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., lactose intolerant, nut allergy..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
//               >
//                 {loading ? 'Analyzing...' : 'Generate Medical Insights'}
//               </button>

//               <button
//                 type="button"
//                 onClick={analyzeFromLastLog}
//                 className="w-full mt-3 bg-white border border-cyan-300 text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all"
//               >
//                 Analyze From Last Log
//               </button>
//             </form>

//             {result && (
//               <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Medical Assessment</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



//with remedies
// frontend/src/components/PredictMedical.tsx
// import { useEffect, useState } from 'react';
// import { ArrowLeft, Stethoscope } from 'lucide-react';
// import axios from 'axios';
// import { FoodLog, Page } from '../types';

// interface PredictMedicalProps {
//   onNavigate: (page: Page) => void;
// }

// interface BackendResponse {
//   recent_risky_foods: string[];
//   recommendations: string[];
//   symptoms: string[];
// }

// export default function PredictMedical({ onNavigate }: PredictMedicalProps) {
//   const [userId, setUserId] = useState('user123');
//   const [formData, setFormData] = useState({
//     symptoms: '',
//     duration: '',
//     frequency: '',
//     medicalHistory: '',
//     currentMedications: '',
//     dietaryRestrictions: ''
//   });

//   const [allergies, setAllergiesInput] = useState('');
//   const [result, setResult] = useState<string>('');
//   const [lastLog, setLastLog] = useState<FoodLog | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch last log from localStorage
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem('foodLogs');
//       if (!raw) return;
//       const logs: FoodLog[] = JSON.parse(raw);
//       if (!Array.isArray(logs) || logs.length === 0) return;
//       const last = logs
//         .slice()
//         .sort((a, b) => +new Date(b.consumedAt) - +new Date(a.consumedAt))[0];
//       setLastLog(last);
//     } catch {
//       // ignore errors
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.symptoms.trim()) {
//       alert('Please enter your symptoms.');
//       return;
//     }

//     setLoading(true);
//     setResult('');

//     try {
//       // Set allergies if provided
//       if (allergies.trim()) {
//         const allergyArray = allergies
//           .split(',')
//           .map(a => a.trim())
//           .filter(a => a);
//         await axios.post('http://localhost:8000/set_allergies/', new URLSearchParams({
//           user_id: userId,
//           allergies: allergyArray.join(',')
//         }), {
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//         });
//       }

//       // Report symptoms to backend
//       const res = await axios.post<BackendResponse>(
//         'http://localhost:8000/report_symptom/',
//         new URLSearchParams({
//           user_id: userId,
//           symptoms: formData.symptoms,
//           lookback: '5'
//         }),
//         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//       );

//       const { recent_risky_foods, recommendations } = res.data;

//       let analysis = `Medical Assessment Summary:\n\nSymptoms Reported: ${formData.symptoms}\n`;
//       analysis += `Duration: ${formData.duration || 'Not specified'}\n`;
//       analysis += `Frequency: ${formData.frequency || 'Not specified'}\n`;
//       analysis += `Medical History: ${formData.medicalHistory || 'Not specified'}\n`;
//       analysis += `Current Medications: ${formData.currentMedications || 'None reported'}\n`;
//       analysis += `Dietary Restrictions: ${formData.dietaryRestrictions || 'None reported'}\n`;

//       if (lastLog) {
//         analysis += `\nRecent Food Log:\n• ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType}) at ${new Date(lastLog.consumedAt).toLocaleString()}\n`;
//         if (lastLog.notes) analysis += `  Notes: ${lastLog.notes}\n`;
//       }

//       // Include risky foods + remedies
//       if (recent_risky_foods.length > 0) {
//         analysis += `\n⚠️ Potential Trigger Foods Detected:\n`;
//         recent_risky_foods.forEach((food, idx) => {
//           analysis += `\n• ${food}\n`;
//           const recStr = recommendations[idx];
//           if (recStr) {
//             // Parse remedies into structured format
//             const parts = recStr.split('. Remedies: ')[1]?.split('|') || [];
//             parts.forEach(part => {
//               const [symptom, medsStr] = part.split(':');
//               if (symptom && medsStr) {
//                 const [meds, homeRemedies] = medsStr.split(',').map(p => p.trim());
//                 analysis += `  - ${symptom.trim()}:\n`;
//                 if (meds) analysis += `      • Medicines: ${meds}\n`;
//                 if (homeRemedies) analysis += `      • Home Remedies: ${homeRemedies}\n`;
//               }
//             });
//           }
//         });
//       } else {
//         analysis += `\n✅ No high-risk foods detected. Maintain a balanced diet.`;
//       }

//       analysis += `\n\nPreliminary Insights:\n• Track symptom patterns in relation to specific foods\n• Keep a detailed log for your medical appointments\n• Consider allergy testing if symptoms are consistent\n\nIMPORTANT DISCLAIMER:\nThis is NOT a medical diagnosis. Consult qualified healthcare professionals for any concerns.`;

//       setResult(analysis);
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.response?.data?.detail || 'Error analyzing data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeFromLastLog = () => {
//     if (!lastLog) return;
//     let analysis = `Medical Assessment (from last log)\n\nRecent Food Log:\n• ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType}) at ${new Date(lastLog.consumedAt).toLocaleString()}\n`;
//     if (lastLog.notes) analysis += `  Notes: ${lastLog.notes}\n`;

//     analysis += `\nPreliminary Insights:\n• Monitor symptoms within 2-6 hours post meal\n• Keep logging to correlate foods and reactions\n• Consider testing for specific intolerances\n\nDisclaimer: Not a diagnosis. Consult licensed professionals.`;
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
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Predict Medical</h1>

//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
//                 <Stethoscope className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800">Medical Insights</h2>
//             </div>

//             <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
//               <p className="text-sm text-yellow-800 font-medium">
//                 This tool provides general information only. Always consult healthcare professionals for medical advice.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
//                 <textarea
//                   required
//                   value={formData.symptoms}
//                   onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
//                   rows={3}
//                   placeholder="Describe your symptoms in detail..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Duration of Symptoms</label>
//                 <input
//                   type="text"
//                   value={formData.duration}
//                   onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 2 weeks, 3 days..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency of Occurrence</label>
//                 <input
//                   type="text"
//                   value={formData.frequency}
//                   onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., Daily, 2-3 times per week..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies (comma-separated)</label>
//                 <input
//                   type="text"
//                   value={allergies}
//                   onChange={(e) => setAllergiesInput(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., lactose, peanuts"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Medical History</label>
//                 <textarea
//                   value={formData.medicalHistory}
//                   onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
//                   rows={2}
//                   placeholder="Previous diagnoses, allergies, family history..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications</label>
//                 <input
//                   type="text"
//                   value={formData.currentMedications}
//                   onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="List any medications you're currently taking..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Restrictions</label>
//                 <input
//                   type="text"
//                   value={formData.dietaryRestrictions}
//                   onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
//                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
//                   placeholder="e.g., lactose intolerant, nut allergy..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
//               >
//                 {loading ? 'Analyzing...' : 'Generate Medical Insights'}
//               </button>

//               <button
//                 type="button"
//                 onClick={analyzeFromLastLog}
//                 className="w-full mt-3 bg-white border border-cyan-300 text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all"
//               >
//                 Analyze From Last Log
//               </button>
//             </form>

//             {result && (
//               <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
//                 <h3 className="font-bold text-slate-800 mb-3 text-lg">Medical Assessment</h3>
//                 <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



//last log on local storage
// import { useEffect, useState } from 'react';
// import { ArrowLeft, Stethoscope } from 'lucide-react';
// import axios from 'axios';
// import { FoodLog, Page } from '../types';

// interface PredictMedicalProps {
//   onNavigate: (page: Page) => void;
// }

// interface BackendResponse {
//   recent_risky_foods: string[];
//   recommendations: string[];
//   symptoms: string[];
// }

// export default function PredictMedical({ onNavigate }: PredictMedicalProps) {
//   const [userId, setUserId] = useState('user123');
//   const [formData, setFormData] = useState({
//     symptoms: '',
//     duration: '',
//     frequency: '',
//     medicalHistory: '',
//     currentMedications: '',
//     dietaryRestrictions: ''
//   });

//   const [allergies, setAllergiesInput] = useState('');
//   const [result, setResult] = useState<string>('');
//   const [lastLog, setLastLog] = useState<FoodLog | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch last log from localStorage
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem('foodLogs');
//       if (!raw) return;
//       const logs: FoodLog[] = JSON.parse(raw);
//       if (!Array.isArray(logs) || logs.length === 0) return;
//       const last = logs
//         .slice()
//         .sort((a, b) => +new Date(b.consumedAt) - +new Date(a.consumedAt))[0];
//       setLastLog(last);
//     } catch {
//       // ignore errors
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.symptoms.trim()) {
//       alert('Please enter your symptoms.');
//       return;
//     }

//     setLoading(true);
//     setResult('');

//     try {
//       // Store allergies if user provided them
//       if (allergies.trim()) {
//         const allergyArray = allergies
//           .split(',')
//           .map(a => a.trim())
//           .filter(a => a);
//         await axios.post('http://localhost:8000/set_allergies/', new URLSearchParams({
//           user_id: userId,
//           allergies: allergyArray.join(',')
//         }), {
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//         });
//       }

//       // Request backend for 7-day analysis
//       const res = await axios.post<BackendResponse>(
//         'http://localhost:8000/report_symptom/',
//         new URLSearchParams({
//           user_id: userId,
//           symptoms: formData.symptoms,
//           lookback: '7'
//         }),
//         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//       );

//       const { recent_risky_foods, recommendations } = res.data;

//       let analysis = `🩺 Medical Assessment Summary\n\n`;
//       analysis += `Symptoms Reported: ${formData.symptoms}\n`;
//       analysis += `Duration: ${formData.duration || 'Not specified'}\n`;
//       analysis += `Frequency: ${formData.frequency || 'Not specified'}\n`;
//       analysis += `Medical History: ${formData.medicalHistory || 'Not specified'}\n`;
//       analysis += `Medications: ${formData.currentMedications || 'None'}\n`;
//       analysis += `Dietary Restrictions: ${formData.dietaryRestrictions || 'None'}\n`;

//       if (lastLog) {
//         analysis += `\nRecent Food Log:\n• ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType}) at ${new Date(lastLog.consumedAt).toLocaleString()}\n`;
//         if (lastLog.notes) analysis += `  Notes: ${lastLog.notes}\n`;
//       }

//       if (recent_risky_foods.length > 0) {
//         analysis += `\n⚠️ Potential Trigger Foods (Past 7 Days):\n`;
//         recent_risky_foods.forEach((food, idx) => {
//           analysis += `• ${food}\n`;
//           const remedy = recommendations[idx];
//           if (remedy) {
//             analysis += `  Remedies / Advice: ${remedy}\n`;
//           }
//         });
//       } else {
//         analysis += `\n✅ No high-risk foods detected in the last 7 days.`;
//       }

//       analysis += `\n\n💡 Insights:\n• Track your meals and symptoms daily for patterns.\n• Avoid or limit foods listed as potential triggers.\n• Consult your healthcare provider for allergy testing.\n\nDisclaimer: This tool does not replace professional medical advice.`;

//       setResult(analysis);
//     } catch (err: any) {
//       console.error('Error analyzing medical data:', err);
//       setResult('⚠️ Error analyzing last 7 days data. Please ensure your backend is running and has recent logs.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeFromLastLog = () => {
//     if (!lastLog) {
//       setResult('No recent logs found to analyze.');
//       return;
//     }
//     let analysis = `🩺 Medical Assessment (Based on Last Log)\n\n`;
//     analysis += `Recent Food: ${lastLog.foodName ?? 'image-only'} (${lastLog.mealType})\nConsumed At: ${new Date(lastLog.consumedAt).toLocaleString()}\n`;
//     if (lastLog.notes) analysis += `Notes: ${lastLog.notes}\n`;
//     analysis += `\nInsights:\n• Watch for symptoms within 6 hours of this meal.\n• Log reactions promptly for better predictions.\n• Avoid suspected ingredients if symptoms repeat.\n\nDisclaimer: Not a diagnosis.`;
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

//         <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
//               <Stethoscope className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800">Medical Insights</h2>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms</label>
//               <textarea
//                 required
//                 value={formData.symptoms}
//                 onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 resize-none"
//                 rows={3}
//                 placeholder="Describe your symptoms..."
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="Duration (e.g., 2 days)"
//                 value={formData.duration}
//                 onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                 className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Frequency (e.g., 3 times/day)"
//                 value={formData.frequency}
//                 onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
//                 className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
//               />
//             </div>

//             <input
//               type="text"
//               placeholder="Allergies (comma-separated)"
//               value={allergies}
//               onChange={(e) => setAllergiesInput(e.target.value)}
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
//             />

//             <textarea
//               placeholder="Medical History"
//               value={formData.medicalHistory}
//               onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 resize-none"
//               rows={2}
//             />

//             <input
//               type="text"
//               placeholder="Current Medications"
//               value={formData.currentMedications}
//               onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
//             />

//             <input
//               type="text"
//               placeholder="Dietary Restrictions"
//               value={formData.dietaryRestrictions}
//               onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all"
//             >
//               {loading ? 'Analyzing...' : 'Generate Medical Insights'}
//             </button>

//             <button
//               type="button"
//               onClick={analyzeFromLastLog}
//               className="w-full mt-3 bg-white border border-cyan-300 text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all"
//             >
//               Analyze From Last Log
//             </button>
//           </form>

//           {result && (
//             <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
//               <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


//logs from backend
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

//integration 1
 

// import { useState, useEffect, ChangeEvent } from 'react';
// import { ArrowLeft, Upload, X, Calendar, Clock } from 'lucide-react';
// import axios from 'axios';

// interface LogEntryProps {
//   onNavigate: (page: string) => void;
//   userId: string;
// }

// export interface FoodLog {
//   id: string;
//   foodName: string;
//   mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
//   consumedAt: string;
//   notes?: string;
//   imageUrl?: string;
//   sicknessInfo?: {
//     riskScore: number;
//     status: string;
//     remedies?: Record<string, string[]>;
//   };
// }

// export default function LogEntry({ onNavigate, userId }: LogEntryProps) {
//   const [entries, setEntries] = useState<FoodLog[]>([]);
//   const [formData, setFormData] = useState({
//     foodName: '',
//     mealType: 'snack' as FoodLog['mealType'],
//     consumedAt: new Date().toISOString().slice(0, 16),
//     notes: '',
//     file: null as File | null
//   });
//   const [imagePreview, setImagePreview] = useState<string>('');

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8000/user_data/${userId}`);
//       const uploads = res.data.uploads || [];
//       setEntries(
//         uploads.map((log: any) => ({
//           id: Date.now().toString() + Math.random(),
//           foodName: log.food,
//           mealType: 'snack', // can extend to backend
//           consumedAt: log.timestamp,
//           imageUrl: '', // optional: save backend image path
//           notes: log.symptoms.join(', '),
//           sicknessInfo: log.sickness_info
//         }))
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const result = reader.result as string;
//         setImagePreview(result);
//       };
//       reader.readAsDataURL(file);
//       setFormData(prev => ({ ...prev, file }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.file) {
//       alert('Please upload an image of your meal.');
//       return;
//     }

//     const data = new FormData();
//     data.append('user_id', userId);
//     data.append('file', formData.file);
//     data.append('symptoms', formData.notes || '');

//     try {
//       const res = await axios.post('http://localhost:8000/upload_image/', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       const newEntry: FoodLog = {
//         id: Date.now().toString(),
//         foodName: res.data.food,
//         mealType: 'snack',
//         consumedAt: res.data.log.timestamp,
//         notes: formData.notes,
//         imageUrl: imagePreview,
//         sicknessInfo: res.data.sickness_info
//       };

//       setEntries(prev => [newEntry, ...prev]);
//       setFormData({ foodName: '', mealType: 'snack', consumedAt: new Date().toISOString().slice(0,16), notes: '', file: null });
//       setImagePreview('');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to upload meal. Please try again.');
//     }
//   };

//   const deleteEntry = (id: string) => {
//     setEntries(prev => prev.filter(e => e.id !== id));
//     // Optional: add backend delete logic if needed
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

//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Log Entry</h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-slate-800 mb-6">New Entry</h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Food Name */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Food Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.foodName}
//                     onChange={e => setFormData(prev => ({ ...prev, foodName: e.target.value }))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="What did you eat?"
//                   />
//                 </div>

//                 {/* Meal Type */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Meal Type</label>
//                   <select
//                     value={formData.mealType}
//                     onChange={e => setFormData(prev => ({ ...prev, mealType: e.target.value as FoodLog['mealType'] }))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   >
//                     <option value="breakfast">Breakfast</option>
//                     <option value="lunch">Lunch</option>
//                     <option value="dinner">Dinner</option>
//                     <option value="snack">Snack</option>
//                   </select>
//                 </div>

//                 {/* Date & Time */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Date & Time</label>
//                   <input
//                     type="datetime-local"
//                     value={formData.consumedAt}
//                     onChange={e => setFormData(prev => ({ ...prev, consumedAt: e.target.value }))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   />
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Image</label>
//                   <div className="relative">
//                     <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload"/>
//                     <label htmlFor="image-upload" className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 cursor-pointer transition-all">
//                       <Upload className="w-5 h-5 text-slate-600" />
//                       <span className="text-slate-600">Choose Image</span>
//                     </label>
//                   </div>

//                   {imagePreview && (
//                     <div className="mt-4 relative">
//                       <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg"/>
//                       <button type="button" onClick={() => { setImagePreview(''); setFormData(prev => ({ ...prev, file: null })); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
//                         <X className="w-4 h-4"/>
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Notes */}
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//                     rows={4}
//                     placeholder="Any additional notes..."
//                   />
//                 </div>

//                 <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
//                   Save Entry
//                 </button>
//               </form>
//             </div>

//             {/* Recent Entries */}
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Entries</h2>
//               <div className="space-y-4 max-h-[800px] overflow-y-auto">
//                 {entries.length === 0 ? (
//                   <p className="text-slate-500 text-center py-8">No entries yet. Add your first meal!</p>
//                 ) : entries.map(entry => (
//                   <div key={entry.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="font-bold text-slate-800 text-lg">{entry.foodName}</h3>
//                         <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-1">
//                           {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
//                         </span>
//                       </div>
//                       <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:text-red-700 transition-colors">
//                         <X className="w-5 h-5"/>
//                       </button>
//                     </div>

//                     {entry.imageUrl && <img src={entry.imageUrl} alt={entry.foodName} className="w-full h-40 object-cover rounded-lg mb-3"/>}

//                     <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
//                       <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/><span>{new Date(entry.consumedAt).toLocaleDateString()}</span></div>
//                       <div className="flex items-center gap-1"><Clock className="w-4 h-4"/><span>{new Date(entry.consumedAt).toLocaleTimeString()}</span></div>
//                     </div>

//                     {entry.notes && <p className="text-slate-600 text-sm">{entry.notes}</p>}
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//integration 2
import { useState, useEffect, ChangeEvent } from "react";
import { ArrowLeft, Upload, X, Calendar, Clock } from "lucide-react";
import { uploadFoodImage, getUserData } from "../api";
import type { FoodLogResponse } from "../api";

// interface LogEntryProps {
//   onNavigate: (page: string) => void;
//   userId: string;
// }
import { Page } from '../types';

interface LogEntryProps {
  onNavigate: (page: Page) => void;
  userId: string;
}


export interface FoodLog {
  id: string;
  foodName: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  consumedAt: string;
  notes?: string;
  imageUrl?: string;
  sicknessInfo?: {
    risk_score: number;
    status: string;
    remedies?: Record<string, string[]>;
  };
}

export default function LogEntry({ onNavigate, userId }: LogEntryProps) {
  const [entries, setEntries] = useState<FoodLog[]>([]);
  const [formData, setFormData] = useState({
    foodName: "",
    mealType: "snack" as FoodLog["mealType"],
    consumedAt: new Date().toISOString().slice(0, 16),
    notes: "",
    file: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputMode, setInputMode] = useState<"name" | "image" | "both">("both");

  // -------------------- Fetch previous user logs -------------------- //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(userId);
        const uploads = data.uploads || [];
        setEntries(
          uploads.map((log: any) => ({
            id: Date.now().toString() + Math.random(),
            foodName: log.food,
            mealType: "snack",
            consumedAt: log.timestamp,
            notes: log.symptoms?.join(", "),
            imageUrl: "",
            sicknessInfo: log.sickness_info,
          }))
        );
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchData();
  }, [userId]);

  // -------------------- Handle image upload -------------------- //
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  // -------------------- Handle form submission -------------------- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMode === "name" && !formData.foodName.trim()) {
      setError("Please enter a food name.");
      return;
    }
    if (inputMode === "image" && !formData.file) {
      setError("Please upload an image.");
      return;
    }
    if (inputMode === "both" && !formData.foodName.trim() && !formData.file) {
      setError("Please provide a food name or upload an image.");
      return;
    }
    setError("");

    try {
      if (!formData.file) {
        alert("Please upload a food image.");
        return;
      }

      const res: FoodLogResponse = await uploadFoodImage(
        userId,
        formData.file,
        formData.notes || ""
      );

      const newEntry: FoodLog = {
        id: Date.now().toString(),
        foodName: res.food || formData.foodName,
        mealType: formData.mealType,
        consumedAt: res.log?.timestamp || new Date().toISOString(),
        notes: formData.notes,
        imageUrl: imagePreview,
        sicknessInfo: res.sickness_info,
      };

      setEntries((prev) => [newEntry, ...prev]);
      setFormData({
        foodName: "",
        mealType: "snack",
        consumedAt: new Date().toISOString().slice(0, 16),
        notes: "",
        file: null,
      });
      setImagePreview("");
    } catch (err) {
      console.error(err);
      alert("Failed to upload meal. Please try again.");
    }
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // -------------------- Render -------------------- //
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

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800 mb-8">Log Entry</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ---------- New Entry Form ---------- */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">New Entry</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Mode Toggle */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Input Mode
                  </label>
                  <div className="inline-flex rounded-lg bg-slate-100 p-1">
                    {["name", "image", "both"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setInputMode(mode as "name" | "image" | "both")}
                        className={`px-3 py-1 rounded-md ${
                          inputMode === mode ? "bg-white shadow" : "text-slate-600"
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Name */}
                {inputMode !== "image" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Food Name
                    </label>
                    <input
                      type="text"
                      value={formData.foodName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, foodName: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="What did you eat?"
                    />
                  </div>
                )}

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mealType: e.target.value as FoodLog["mealType"],
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.consumedAt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, consumedAt: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Image Upload */}
                {inputMode !== "name" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 cursor-pointer transition-all"
                      >
                        <Upload className="w-5 h-5 text-slate-600" />
                        <span className="text-slate-600">Choose Image</span>
                      </label>
                    </div>

                    {imagePreview && (
                      <div className="mt-4 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData((prev) => ({ ...prev, file: null }));
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder="Any additional notes..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Entry
                </button>
              </form>
            </div>

            {/* ---------- Recent Entries ---------- */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Recent Entries
              </h2>
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    No entries yet. Add your first meal!
                  </p>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">
                            {entry.foodName}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-1">
                            {entry.mealType.charAt(0).toUpperCase() +
                              entry.mealType.slice(1)}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {entry.imageUrl && (
                        <img
                          src={entry.imageUrl}
                          alt={entry.foodName}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}

                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(entry.consumedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(entry.consumedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {entry.notes && (
                        <p className="text-slate-600 text-sm">{entry.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

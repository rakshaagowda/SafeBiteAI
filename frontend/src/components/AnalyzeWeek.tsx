// import { useState, useEffect } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { FoodLog } from '../types';

// interface AnalyzeWeekProps {
//   onNavigate: (page: string) => void;
// }

// interface DayData {
//   day: string;
//   meals: number;
// }

// export default function AnalyzeWeek({ onNavigate }: AnalyzeWeekProps) {
//   const [weekData, setWeekData] = useState<DayData[]>([]);
//   const [mealTypeData, setMealTypeData] = useState<{ type: string; count: number }[]>([]);

//   useEffect(() => {
//     const saved = localStorage.getItem('foodLogs');
//     const logs: FoodLog[] = saved ? JSON.parse(saved) : [];

//     const now = new Date();
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

//     const recentLogs = logs.filter(log => new Date(log.consumedAt) >= weekAgo);

//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const dailyCounts: { [key: string]: number } = {};

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
//       const dayName = dayNames[date.getDay()];
//       dailyCounts[dayName] = 0;
//     }

//     recentLogs.forEach(log => {
//       const date = new Date(log.consumedAt);
//       const dayName = dayNames[date.getDay()];
//       if (dayName in dailyCounts) {
//         dailyCounts[dayName]++;
//       }
//     });

//     const weekDataArray = Object.entries(dailyCounts).map(([day, meals]) => ({
//       day,
//       meals
//     }));
//     setWeekData(weekDataArray);

//     const mealCounts: { [key: string]: number } = {
//       breakfast: 0,
//       lunch: 0,
//       dinner: 0,
//       snack: 0
//     };

//     recentLogs.forEach(log => {
//       mealCounts[log.mealType]++;
//     });

//     const mealTypeArray = Object.entries(mealCounts).map(([type, count]) => ({
//       type: type.charAt(0).toUpperCase() + type.slice(1),
//       count
//     }));
//     setMealTypeData(mealTypeArray);
//   }, []);

//   const maxMeals = Math.max(...weekData.map(d => d.meals), 1);

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
//           <h1 className="text-4xl font-bold text-slate-800 mb-8">Analyze Week</h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-slate-800 mb-6">Daily Meal Count</h2>

//               <div className="space-y-4">
//                 {weekData.map((data, index) => {
//                   const barWidth = (data.meals / maxMeals) * 100;

//                   return (
//                     <div key={index} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="font-semibold text-slate-700 w-12">{data.day}</span>
//                         <span className="text-sm font-medium text-slate-600">{data.meals} meals</span>
//                       </div>
//                       <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full flex items-center justify-start px-3 transition-all duration-500"
//                           style={{ width: `${barWidth}%` }}
//                         >
//                           {data.meals > 0 && (
//                             <span className="text-white text-sm font-semibold">{data.meals}</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="mt-8 p-4 bg-green-50 rounded-lg">
//                 <p className="text-sm text-green-800">
//                   <span className="font-semibold">Total this week:</span> {weekData.reduce((sum, d) => sum + d.meals, 0)} meals
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-slate-800 mb-6">Meal Type Distribution</h2>

//               <div className="space-y-6">
//                 {mealTypeData.map((data, index) => {
//                   const colors = [
//                     'from-orange-400 to-orange-500',
//                     'from-blue-400 to-blue-500',
//                     'from-cyan-400 to-cyan-500',
//                     'from-red-400 to-red-500'
//                   ];
//                   const total = mealTypeData.reduce((sum, d) => sum + d.count, 0);
//                   const percentage = total > 0 ? ((data.count / total) * 100).toFixed(1) : '0';

//                   return (
//                     <div key={index} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="font-semibold text-slate-700">{data.type}</span>
//                         <span className="text-sm font-medium text-slate-600">
//                           {data.count} ({percentage}%)
//                         </span>
//                       </div>
//                       <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
//                         <div
//                           className={`bg-gradient-to-r ${colors[index % colors.length]} h-full rounded-full flex items-center justify-start px-3 transition-all duration-500`}
//                           style={{ width: `${percentage}%` }}
//                         >
//                           {data.count > 0 && (
//                             <span className="text-white text-sm font-semibold">{data.count}</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="mt-8 p-4 bg-slate-100 rounded-lg">
//                 <h3 className="font-semibold text-slate-800 mb-2">Weekly Insights</h3>
//                 <ul className="text-sm text-slate-600 space-y-1">
//                   <li>Track patterns between meals and how you feel</li>
//                   <li>Maintain consistent meal times for better alertness</li>
//                   <li>Balance different meal types throughout the week</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
//             <h2 className="text-2xl font-bold text-slate-800 mb-6">Weekly Timeline</h2>

//             <div className="flex items-end justify-between h-64 gap-2">
//               {weekData.map((data, index) => {
//                 const barHeight = maxMeals > 0 ? (data.meals / maxMeals) * 100 : 0;

//                 return (
//                   <div key={index} className="flex-1 flex flex-col items-center gap-2">
//                     <div className="relative w-full h-full flex items-end">
//                       <div
//                         className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-500 relative group"
//                         style={{ height: `${barHeight}%` }}
//                       >
//                         {data.meals > 0 && (
//                           <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-slate-700">
//                             {data.meals}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <span className="text-sm font-semibold text-slate-700">{data.day}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// //

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Page } from '../types';

interface AnalyzeWeekProps {
  onNavigate: (page: Page) => void;
  userId: string;
}

interface FoodLog {
  id: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt: string;
  notes?: string;
  imageUrl?: string;
  sicknessInfo?: {
    riskScore: number;
    status: string;
  };
}

interface DayData {
  day: string;
  meals: number;
}

export default function AnalyzeWeek({ onNavigate, userId }: AnalyzeWeekProps) {
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [mealTypeData, setMealTypeData] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/user_data/${userId}`);
        const logs: FoodLog[] = (res.data.uploads || []).map((log: any) => ({
          id: Date.now().toString() + Math.random(),
          foodName: log.food,
          mealType: 'snack', // default, can extend backend to store mealType
          consumedAt: log.timestamp,
          notes: (log.symptoms || []).join(', '),
          imageUrl: '',
          sicknessInfo: log.sickness_info
        }));

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentLogs = logs.filter(log => new Date(log.consumedAt) >= weekAgo);

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyCounts: { [key: string]: number } = {};
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          dailyCounts[dayNames[date.getDay()]] = 0;
        }
        recentLogs.forEach(log => {
          const dayName = dayNames[new Date(log.consumedAt).getDay()];
          dailyCounts[dayName]++;
        });
        setWeekData(Object.entries(dailyCounts).map(([day, meals]) => ({ day, meals })));

        const mealCounts: { [key: string]: number } = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
        recentLogs.forEach(log => mealCounts[log.mealType]++);
        setMealTypeData(Object.entries(mealCounts).map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count
        })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, [userId]);

  const maxMeals = Math.max(...weekData.map(d => d.meals), 1);

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

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800 mb-8">Analyze Week</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Meal Count */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Daily Meal Count</h2>
              <div className="space-y-4">
                {weekData.map((data, idx) => {
                  const barWidth = (data.meals / maxMeals) * 100;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700 w-12">{data.day}</span>
                        <span className="text-sm font-medium text-slate-600">{data.meals} meals</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full flex items-center justify-start px-3 transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        >
                          {data.meals > 0 && (
                            <span className="text-white text-sm font-semibold">{data.meals}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meal Type Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Meal Type Distribution</h2>
              <div className="space-y-6">
                {mealTypeData.map((data, idx) => {
                  const colors = ['from-orange-400 to-orange-500','from-blue-400 to-blue-500','from-cyan-400 to-cyan-500','from-red-400 to-red-500'];
                  const total = mealTypeData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = total > 0 ? ((data.count / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">{data.type}</span>
                        <span className="text-sm font-medium text-slate-600">{data.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
                        <div className={`bg-gradient-to-r ${colors[idx % colors.length]} h-full rounded-full flex items-center justify-start px-3 transition-all duration-500`} style={{ width: `${percentage}%` }}>
                          {data.count > 0 && <span className="text-white text-sm font-semibold">{data.count}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly Timeline */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Weekly Timeline</h2>
            <div className="flex items-end justify-between h-64 gap-2">
              {weekData.map((data, idx) => {
                const barHeight = (data.meals / maxMeals) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-500 relative group"
                        style={{ height: `${barHeight}%` }}
                      >
                        {data.meals > 0 && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-slate-700">
                            {data.meals}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Insights */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Weekly Insights</h2>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>Track patterns between meals and how you feel</li>
              <li>Maintain consistent meal times for better alertness</li>
              <li>Balance different meal types throughout the week</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

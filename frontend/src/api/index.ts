
// // frontend/src/api/index.ts
// import axios, { AxiosResponse } from "axios";

// // -------------------- Environment Setup -------------------- //
// const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // fallback

// // -------------------- Axios Instance -------------------- //
// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 10000,
// });

// // -------------------- Type Definitions -------------------- //
// export interface SicknessInfo {
//   risk_score: number;
//   status: string;
//   remedies: Record<string, string[]>;
// }

// export interface FoodLogResponse {
//   food: string;
//   sickness_info: SicknessInfo;
//   log?: Record<string, any>;
// }

// export interface ReportSymptomResponse {
//   symptoms: string[];
//   recent_risky_foods: string[];
//   recommendations: string[];
// }

// export interface UserDataResponse {
//   user_id: string;
//   uploads?: any[];
//   symptoms?: any[];
// }

// export interface PredictAlertnessRequest {
//   user_id: string;
//   sleep_hours: number;
//   meal_timing: string;
//   caffeine_intake: string;
//   current_alertness: number;
//   activity_level: string;
//   stress_level: number;
// }

// export interface PredictAlertnessResponse {
//   timestamp: string;
//   sleep_hours: number;
//   meal_timing: string;
//   caffeine_intake: string;
//   current_alertness: number;
//   activity_level: string;
//   stress_level: number;
//   predicted_alertness: number;
//   recommendations: string[];
// }

// // -------------------- API Calls -------------------- //

// export const uploadFoodImage = async (
//   userId: string,
//   file: File,
//   symptoms?: string
// ): Promise<FoodLogResponse> => {
//   const formData = new FormData();
//   formData.append("user_id", userId);
//   formData.append("file", file);
//   if (symptoms) formData.append("symptoms", symptoms);

//   const response: AxiosResponse<FoodLogResponse> = await api.post("/upload_image/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

// export const reportSymptoms = async (
//   userId: string,
//   symptoms: string,
//   lookback: number = 5
// ): Promise<ReportSymptomResponse> => {
//   const formData = new FormData();
//   formData.append("user_id", userId);
//   formData.append("symptoms", symptoms);
//   formData.append("lookback", lookback.toString());

//   const response: AxiosResponse<ReportSymptomResponse> = await api.post("/report_symptom/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

// export const getUserData = async (userId: string): Promise<UserDataResponse> => {
//   const response: AxiosResponse<UserDataResponse> = await api.get(`/user_data/${userId}`);
//   return response.data;
// };

// export const predictAlertness = async (
//   data: PredictAlertnessRequest
// ): Promise<PredictAlertnessResponse> => {
//   const formData = new FormData();
//   formData.append("user_id", data.user_id);
//   formData.append("sleep_hours", data.sleep_hours.toString());
//   formData.append("meal_timing", data.meal_timing);
//   formData.append("caffeine_intake", data.caffeine_intake);
//   formData.append("current_alertness", data.current_alertness.toString());
//   formData.append("activity_level", data.activity_level);
//   formData.append("stress_level", data.stress_level.toString());

//   const response: AxiosResponse<PredictAlertnessResponse> = await api.post(
//     "/predict_alertness/",
//     formData,
//     { headers: { "Content-Type": "multipart/form-data" } }
//   );
//   return response.data;
// };

// // -------------------- Default Export -------------------- //
// export default {
//   uploadFoodImage,
//   reportSymptoms,
//   getUserData,
//   predictAlertness,
// };




//after changing PredictMedical.tsx
import axios, { AxiosResponse } from "axios";

// -------------------- Environment Setup -------------------- //
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // fallback

// -------------------- Axios Instance -------------------- //
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// -------------------- Type Definitions -------------------- //
export interface SicknessInfo {
  risk_score: number;
  status: string;
  remedies: Record<string, string[]>;
}

export interface FoodLogResponse {
  food: string;
  sickness_info: SicknessInfo;
  ingredients?: string[];
  allergy_alert?: any;
  log?: Record<string, any>;
}

export interface ReportSymptomResponse {
  symptoms: string[];
  recent_risky_foods: string[];
  recommendations: string[];
}

export interface UserDataResponse {
  user_id: string;
  uploads?: any[];
  symptoms?: any[];
  allergies?: string[];
}

export interface PredictAlertnessRequest {
  user_id: string;
  sleep_hours: number;
  meal_timing: string;
  caffeine_intake: string;
  current_alertness: number;
  activity_level: string;
  stress_level: number;
}

export interface PredictAlertnessResponse {
  timestamp: string;
  sleep_hours: number;
  meal_timing: string;
  caffeine_intake: string;
  current_alertness: number;
  activity_level: string;
  stress_level: number;
  predicted_alertness: number;
  recommendations: string[];
}

// -------------------- API Calls -------------------- //

/**
 * Upload a food image for classification & sickness detection
 * Endpoint: /upload_image/
 */
export const uploadFoodImage = async (
  userId: string,
  file: File,
  symptoms?: string
): Promise<FoodLogResponse> => {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("file", file);
  if (symptoms) formData.append("symptoms", symptoms);

  const response: AxiosResponse<FoodLogResponse> = await api.post("/upload_image/", formData, {
  });
  return response.data;
};

/**
 * Report symptoms manually
 * Endpoint: /report_symptom/
 */
export const reportSymptoms = async (
  userId: string,
  symptoms: string,
  lookback: number = 5
): Promise<ReportSymptomResponse> => {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("symptoms", symptoms);
  formData.append("lookback", lookback.toString());

  const response: AxiosResponse<ReportSymptomResponse> = await api.post("/report_symptom/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Set or update user's allergies
 * Endpoint: /set_allergies/
 */
export const setAllergies = async (
  userId: string,
  allergies: string[]
): Promise<{ message: string; allergies: string[] }> => {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("allergies", allergies.join(",")); // send as comma-separated string

  const response: AxiosResponse<{ message: string; allergies: string[] }> = await api.post(
    "/set_allergies/",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

/**
 * Fetch full user history (uploads, symptoms, allergies)
 * Endpoint: /user_data/{user_id}
 */
export const getUserData = async (userId: string): Promise<UserDataResponse> => {
  const response: AxiosResponse<UserDataResponse> = await api.get(`/user_data/${userId}`);
  return response.data;
};

/**
 * Predict alertness based on lifestyle inputs
 * Endpoint: /predict_alertness/
 */
export const predictAlertness = async (
  data: PredictAlertnessRequest
): Promise<PredictAlertnessResponse> => {
  const formData = new FormData();
  formData.append("user_id", data.user_id);
  formData.append("sleep_hours", data.sleep_hours.toString());
  formData.append("meal_timing", data.meal_timing);
  formData.append("caffeine_intake", data.caffeine_intake);
  formData.append("current_alertness", data.current_alertness.toString());
  formData.append("activity_level", data.activity_level);
  formData.append("stress_level", data.stress_level.toString());

  const response: AxiosResponse<PredictAlertnessResponse> = await api.post(
    "/predict_alertness/",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

// -------------------- Default Export -------------------- //
export default {
  uploadFoodImage,
  reportSymptoms,
  setAllergies,
  getUserData,
  predictAlertness,
};

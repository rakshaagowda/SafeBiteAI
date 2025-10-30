export interface FoodLog {
  id: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt: string;
  imageUrl?: string;
  notes?: string;
}

export interface SymptomLog {
  id: string;
  symptomType: string;
  severity: number;
  occurredAt: string;
  notes?: string;
}

export interface PredictionInput {
  type: 'cause' | 'alertness' | 'medical';
  data: Record<string, any>;
}

export type Page =
  | 'dashboard'
  | 'log-entry'
  | 'analyze-week'
  | 'predict-cause'
  | 'predict-alertness'
  | 'predict-medical'
  |'home';

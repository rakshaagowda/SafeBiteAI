import { BookOpen, TrendingUp, Search, AlertCircle, Stethoscope } from 'lucide-react';
import { Page } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const cards: {
    id: Page;
    title: string;
    description: string;
    icon: any;
    color: string;
    hoverColor: string;
  }[] = [
    {
      id: 'log-entry',
      title: 'Log Entry',
      description: 'Record your meals and food intake with images',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'analyze-week',
      title: 'Analyze Week',
      description: 'View weekly patterns and trends with graphs',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'predict-cause',
      title: 'Predict Cause',
      description: 'Identify potential food triggers',
      icon: Search,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      id: 'predict-alertness',
      title: 'Predict Alertness',
      description: 'Analyze alertness levels and patterns',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    },
    {
      id: 'predict-medical',
      title: 'Predict Medical',
      description: 'Get medical insights and recommendations',
      icon: Stethoscope,
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Safebite.AI
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Monitor your food intake, track symptoms, and discover patterns to improve your wellbeing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.color} ${card.hoverColor} transition-all duration-300 mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {card.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className={`h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


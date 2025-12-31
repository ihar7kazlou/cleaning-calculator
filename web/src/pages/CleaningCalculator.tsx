import { useState, useEffect } from 'react';

type CleaningType = 'regular_weekly' | 'regular_monthly' | 'deep' | 'one_time';
type AreaType = 'bedrooms' | 'bathrooms' | 'half_bath' | 'living_room' | 'dining_room' | 'kitchen' | 'laundry' | 'office' | 'basement' | 'additional';
type ExtraService = 'oven' | 'fridge' | 'dishwasher' | 'kitchen_cabinets' | 'windows' | 'window_tracks' | 'blinds' | 'baseboards' | 'make_bed' | 'walls' | 'laundry' | 'vacuum' | 'heavy_duty';

interface Area {
  id: AreaType;
  name: string;
  icon: string;
  price: number;
}

interface ExtraServiceItem {
  id: ExtraService;
  name: string;
  icon: string;
  price: number;
}

const squareFootageOptions = [
  { value: 'small', label: 'Up to 1,000 sq ft', min: 0, max: 1000 },
  { value: 'medium', label: '1,000 - 2,000 sq ft', min: 1000, max: 2000 },
  { value: 'large', label: '2,000 - 3,000 sq ft', min: 2000, max: 3000 },
  { value: 'xlarge', label: '3,000 - 4,000 sq ft', min: 3000, max: 4000 },
  { value: 'xxlarge', label: '4,000+ sq ft', min: 4000, max: 10000 },
];

const cleaningTypes = [
  { 
    id: 'regular_weekly' as CleaningType, 
    name: 'Regular Cleaning', 
    subtitle: 'Weekly or Bi-weekly',
    icon: '🧴',
    gradient: 'from-blue-500 to-cyan-500',
    basePrice: 0.15, // $0.15 per sq ft
    multiplier: 0.85
  },
  { 
    id: 'regular_monthly' as CleaningType, 
    name: 'Regular Cleaning', 
    subtitle: 'Monthly',
    icon: '🧴',
    gradient: 'from-cyan-500 to-teal-500',
    basePrice: 0.15,
    multiplier: 0.95
  },
  { 
    id: 'deep' as CleaningType, 
    name: 'Deep Clean', 
    subtitle: 'Deep or Move In/Out',
    icon: '⭐',
    gradient: 'from-purple-500 to-pink-500',
    basePrice: 0.25,
    multiplier: 1
  },
  { 
    id: 'one_time' as CleaningType, 
    name: 'One Time', 
    subtitle: 'Standard Clean',
    icon: '🪣',
    gradient: 'from-orange-500 to-amber-500',
    basePrice: 0.20,
    multiplier: 1
  },
];

const areas: Area[] = [
  { id: 'bedrooms', name: 'Bedrooms', icon: '🛏️', price: 25 },
  { id: 'bathrooms', name: 'Bathrooms', icon: '🛁', price: 40 },
  { id: 'half_bath', name: 'Half Bath', icon: '🚿', price: 20 },
  { id: 'living_room', name: 'Living Room', icon: '🛋️', price: 30 },
  { id: 'dining_room', name: 'Dining Room', icon: '🍽️', price: 25 },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳', price: 35 },
  { id: 'laundry', name: 'Laundry Room', icon: '🧺', price: 20 },
  { id: 'office', name: 'Office', icon: '💼', price: 25 },
  { id: 'basement', name: 'Basement', icon: '🏠', price: 30 },
  { id: 'additional', name: 'Additional', icon: '🏢', price: 20 },
];

const extraServices: ExtraServiceItem[] = [
  { id: 'oven', name: 'Oven', icon: '🔥', price: 75 },
  { id: 'fridge', name: 'Refrigerator', icon: '❄️', price: 60 },
  { id: 'dishwasher', name: 'Dishwasher', icon: '🍽️', price: 40 },
  { id: 'kitchen_cabinets', name: 'Kitchen Cabinets', icon: '🗄️', price: 100 },
  { id: 'windows', name: 'Windows', icon: '🪟', price: 25 },
  { id: 'window_tracks', name: 'Window Tracks', icon: '🪟', price: 15 },
  { id: 'blinds', name: 'Blinds', icon: '🪟', price: 20 },
  { id: 'baseboards', name: 'Baseboards', icon: '📏', price: 30 },
  { id: 'make_bed', name: 'Make Bed', icon: '🛏️', price: 10 },
  { id: 'walls', name: 'Walls', icon: '🖌️', price: 75 },
  { id: 'laundry', name: 'Laundry', icon: '🧺', price: 50 },
  { id: 'vacuum', name: 'Vacuum Furniture', icon: '🛋️', price: 40 },
  { id: 'heavy_duty', name: 'Heavy Duty', icon: '⭐', price: 125 },
];

interface Calculation {
  id: string;
  cleaningType: CleaningType;
  squareFootage: string;
  areas: Record<AreaType, number>;
  extraServices: Record<ExtraService, number>;
  totalCost: number;
  createdAt: string;
}

// Use environment variable in production, or proxy in development
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/cleaning`
  : '/api/cleaning';

type Step = 'square' | 'cleaning' | 'areas' | 'extras' | 'result';

const stepConfig = {
  square: {
    question: 'What is the square footage of your space?',
    subtitle: 'Select the option that best fits your home',
    icon: '📏',
  },
  cleaning: {
    question: 'What type of cleaning do you need?',
    subtitle: 'Choose the option that works best for you',
    icon: '🧹',
  },
  areas: {
    question: 'Which rooms need cleaning?',
    subtitle: 'Select the number of each room type',
    icon: '🏠',
  },
  extras: {
    question: 'Any extra services needed?',
    subtitle: 'Add any additional services you\'d like',
    icon: '✨',
  },
  result: {
    question: 'Here\'s your estimate!',
    subtitle: 'Review the details and save your quote',
    icon: '💰',
  },
};

export default function CleaningCalculator() {
  const [currentStep, setCurrentStep] = useState<Step>('square');
  const [squareFootage, setSquareFootage] = useState<string>('');
  const [cleaningType, setCleaningType] = useState<CleaningType | null>(null);
  const [areaCounts, setAreaCounts] = useState<Record<AreaType, number>>({
    bedrooms: 0,
    bathrooms: 0,
    half_bath: 0,
    living_room: 0,
    dining_room: 0,
    kitchen: 0,
    laundry: 0,
    office: 0,
    basement: 0,
    additional: 0,
  });
  const [extraServiceCounts, setExtraServiceCounts] = useState<Record<ExtraService, number>>({
    oven: 0,
    fridge: 0,
    dishwasher: 0,
    kitchen_cabinets: 0,
    windows: 0,
    window_tracks: 0,
    blinds: 0,
    baseboards: 0,
    make_bed: 0,
    walls: 0,
    laundry: 0,
    vacuum: 0,
    heavy_duty: 0,
  });
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const calculateCost = () => {
    if (!cleaningType || !squareFootage) return 0;

    const selectedType = cleaningTypes.find(t => t.id === cleaningType)!;
    const footageOption = squareFootageOptions.find(o => o.value === squareFootage)!;
    const avgSquare = (footageOption.min + footageOption.max) / 2;

    let baseCost = avgSquare * selectedType.basePrice;
    let areasCost = 0;
    Object.entries(areaCounts).forEach(([areaId, count]) => {
      const area = areas.find(a => a.id === areaId as AreaType)!;
      areasCost += area.price * count;
    });

    let extrasCost = 0;
    Object.entries(extraServiceCounts).forEach(([serviceId, count]) => {
      const service = extraServices.find(s => s.id === serviceId as ExtraService)!;
      extrasCost += service.price * count;
    });

    const total = (baseCost + areasCost + extrasCost) * selectedType.multiplier;
    return Math.round(total);
  };

  const totalCost = calculateCost();

  // Typewriter effect for questions
  useEffect(() => {
    const config = stepConfig[currentStep];
    setTypingText('');
    setShowCursor(true);
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < config.question.length) {
        setTypingText(config.question.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowCursor(false), 500);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentStep]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/calculations?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveCalculation = async () => {
    if (!cleaningType || !squareFootage) {
      alert('Please select square footage and cleaning type');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/calculations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleaningType,
          squareFootage,
          areas: areaCounts,
          extraServices: extraServiceCounts,
          totalCost,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date().toLocaleTimeString('en-US'));
        await loadHistory();
        setTimeout(() => setLastSaved(null), 3000);
      } else {
        alert('Error saving calculation');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save calculation. Please check if the server is running.');
    } finally {
      setSaving(false);
    }
  };

  const handleSquareFootageSelect = (value: string) => {
    setSquareFootage(value);
    setTimeout(() => setCurrentStep('cleaning'), 800);
  };

  const handleCleaningTypeSelect = (type: CleaningType) => {
    setCleaningType(type);
    setTimeout(() => setCurrentStep('areas'), 800);
  };

  const handleAreasNext = () => {
    setTimeout(() => setCurrentStep('extras'), 800);
  };

  const handleExtrasNext = () => {
    setTimeout(() => setCurrentStep('result'), 800);
  };

  const updateAreaCount = (areaId: AreaType, delta: number) => {
    setAreaCounts(prev => ({
      ...prev,
      [areaId]: Math.max(0, prev[areaId] + delta)
    }));
  };

  const updateExtraServiceCount = (serviceId: ExtraService, delta: number) => {
    setExtraServiceCounts(prev => ({
      ...prev,
      [serviceId]: Math.max(0, prev[serviceId] + delta)
    }));
  };

  const clearExtraServices = () => {
    setExtraServiceCounts({
      oven: 0,
      fridge: 0,
      dishwasher: 0,
      kitchen_cabinets: 0,
      windows: 0,
      window_tracks: 0,
      blinds: 0,
      baseboards: 0,
      make_bed: 0,
      walls: 0,
      laundry: 0,
      vacuum: 0,
      heavy_duty: 0,
    });
  };

  const hasExtraServices = Object.values(extraServiceCounts).some(count => count > 0);
  const hasAreas = Object.values(areaCounts).some(count => count > 0);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    const config = stepConfig[currentStep];

    switch (currentStep) {
      case 'square':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-stepFadeIn">
            <div className="text-8xl mb-4 animate-bounce-slow">{config.icon}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {squareFootageOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSquareFootageSelect(option.value)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-110 hover:rotate-2 ${
                    squareFootage === option.value
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-transparent scale-105 shadow-2xl'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-2">{config.icon}</div>
                  <div className={`text-xl font-bold ${squareFootage === option.value ? 'text-white' : 'text-slate-300'}`}>
                    {option.label}
                  </div>
                  {squareFootage === option.value && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-green-500 text-lg">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'cleaning':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-stepFadeIn">
            <div className="text-8xl mb-4 animate-bounce-slow">{config.icon}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              {cleaningTypes.map((type, index) => (
                <button
                  key={type.id}
                  onClick={() => handleCleaningTypeSelect(type.id)}
                  className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-110 hover:rotate-2 ${
                    cleaningType === type.id
                      ? `bg-gradient-to-br ${type.gradient} border-transparent scale-105 shadow-2xl`
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`text-6xl mb-4 transition-transform duration-300 ${cleaningType === type.id ? 'scale-125' : ''}`}>
                    {type.icon}
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${cleaningType === type.id ? 'text-white' : 'text-slate-300'}`}>
                    {type.name}
                  </div>
                  <div className={`text-sm ${cleaningType === type.id ? 'text-white/90' : 'text-slate-400'}`}>
                    {type.subtitle}
                  </div>
                  {cleaningType === type.id && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-green-500 text-lg">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'areas':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-stepFadeIn">
            <div className="text-8xl mb-4 animate-bounce-slow">{config.icon}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-5xl">
              {areas.map((area, index) => (
                <div
                  key={area.id}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 text-center transition-all duration-500 hover:bg-white/20 hover:scale-110 hover:rotate-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-5xl mb-3 animate-bounce-slow">{area.icon}</div>
                  <div className="text-white font-bold text-sm mb-3">{area.name}</div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateAreaCount(area.id, -1)}
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all duration-300 disabled:opacity-30 hover:scale-125"
                      disabled={areaCounts[area.id] === 0}
                    >
                      −
                    </button>
                    <span className="text-white font-black text-2xl min-w-[3rem]">{areaCounts[area.id]}</span>
                    <button
                      onClick={() => updateAreaCount(area.id, 1)}
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all duration-300 hover:scale-125"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {hasAreas && (
              <button
                onClick={handleAreasNext}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-xl font-black shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
              >
                Continue →
              </button>
            )}
          </div>
        );

      case 'extras':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-stepFadeIn">
            <div className="text-8xl mb-4 animate-bounce-slow">{config.icon}</div>
            <button
              onClick={clearExtraServices}
              className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
                !hasExtraServices
                  ? 'bg-white/20 border-2 border-white/30 text-white scale-105'
                  : 'bg-white/10 border-2 border-white/20 text-slate-300 hover:bg-white/20'
              }`}
            >
              ✕ No Extra Services Needed
            </button>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full max-w-6xl">
              {extraServices.map((service, index) => (
                <div
                  key={service.id}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 text-center transition-all duration-500 hover:bg-white/20 hover:scale-110 hover:rotate-2"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="text-5xl mb-3 animate-bounce-slow">{service.icon}</div>
                  <div className="text-white font-bold text-xs mb-3 leading-tight">{service.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateExtraServiceCount(service.id, -1)}
                      className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all duration-300 disabled:opacity-30 hover:scale-125"
                      disabled={extraServiceCounts[service.id] === 0}
                    >
                      −
                    </button>
                    <span className="text-white font-black text-xl min-w-[2rem]">{extraServiceCounts[service.id]}</span>
                    <button
                      onClick={() => updateExtraServiceCount(service.id, 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all duration-300 hover:scale-125"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleExtrasNext}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white text-xl font-black shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
            >
              View Estimate →
            </button>
          </div>
        );

      case 'result':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-stepFadeIn w-full max-w-4xl">
            <div className="text-8xl mb-4 animate-bounce-slow">{config.icon}</div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 border-2 border-white/30 rounded-3xl p-8 shadow-2xl w-full">
              <div className="space-y-4 mb-6">
                {squareFootage && (
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <span className="text-slate-300 font-semibold">Square Footage:</span>
                    <span className="text-white font-bold text-lg">
                      {squareFootageOptions.find(o => o.value === squareFootage)?.label}
                    </span>
                  </div>
                )}
                
                {cleaningType && (
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <span className="text-slate-300 font-semibold">Cleaning Type:</span>
                    <span className="text-white font-bold text-lg">
                      {cleaningTypes.find(t => t.id === cleaningType)?.name}
                    </span>
                  </div>
                )}

                {Object.values(areaCounts).some(c => c > 0) && (
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-slate-300 font-semibold mb-2">Rooms:</div>
                    <div className="space-y-1">
                      {areas.filter(a => areaCounts[a.id] > 0).map(area => (
                        <div key={area.id} className="flex justify-between text-sm text-slate-300">
                          <span>{area.name} × {areaCounts[area.id]}</span>
                          <span className="text-white font-bold">
                            ${area.price * areaCounts[area.id]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasExtraServices && (
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-slate-300 font-semibold mb-2">Extra Services:</div>
                    <div className="space-y-1">
                      {extraServices.filter(s => extraServiceCounts[s.id] > 0).map(service => (
                        <div key={service.id} className="flex justify-between text-sm text-slate-300">
                          <span>{service.name} × {extraServiceCounts[service.id]}</span>
                          <span className="text-white font-bold">
                            ${service.price * extraServiceCounts[service.id]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t-2 border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-white">Total:</span>
                    <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
                      ${totalCost.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={saveCalculation}
                  disabled={saving}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white font-black text-lg shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? '⏳ Saving...' : '💾 Save Estimate'}
                </button>
                
                <button 
                  onClick={() => goToStep('square')}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl text-white font-black text-lg shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  🚀 Book Cleaning Service
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {(['square', 'cleaning', 'areas', 'extras', 'result'] as Step[]).map((step, index) => {
            const stepIndex = ['square', 'cleaning', 'areas', 'extras', 'result'].indexOf(currentStep);
            return (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index <= stepIndex
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-125'
                    : 'bg-white/20'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* History button */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105"
      >
        {showHistory ? '✕' : '📊'}
      </button>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <div className="absolute top-20 right-6 z-20 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl max-h-96 overflow-y-auto custom-scrollbar w-80">
          <div className="space-y-2">
            {history.map((calc) => (
              <div
                key={calc.id}
                className="p-3 backdrop-blur-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl cursor-pointer transition-all duration-300 hover:from-white/10 hover:to-white/15"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">
                      {cleaningTypes.find(t => t.id === calc.cleaningType)?.name}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {squareFootageOptions.find(o => o.value === calc.squareFootage)?.label}
                    </div>
                  </div>
                  <div className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 ml-2">
                    ${calc.totalCost.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content - Full Screen Step */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        {/* Question */}
        <div className="text-center mb-12 animate-questionAppear">
          <div className="text-6xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            {typingText}
            {showCursor && <span className="animate-blink">|</span>}
          </div>
          <p className="text-xl text-slate-300 font-light">
            {stepConfig[currentStep].subtitle}
          </p>
        </div>

        {/* Step Content */}
        {renderStep()}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes stepFadeIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            filter: blur(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        .animate-stepFadeIn {
          animation: stepFadeIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes questionAppear {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-questionAppear {
          animation: questionAppear 0.6s ease-out forwards;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
}

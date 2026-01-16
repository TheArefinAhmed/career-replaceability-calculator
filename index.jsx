import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Globe, 
  Award, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  RefreshCw,
  Terminal,
  ShieldAlert,
  TrendingDown
} from 'lucide-react';

// --- DATA & HEURISTICS ---

const ROLES = [
  { id: 'swe_fe', label: 'Frontend Developer', baseRisk: 45, reason: "AI is rapidly mastering UI code generation." },
  { id: 'swe_be', label: 'Backend Developer', baseRisk: 40, reason: "Logic is harder to mock, but boilerplate is automating fast." },
  { id: 'copywriter', label: 'Copywriter / Content', baseRisk: 85, reason: "Generative LLMs have commoditized average text." },
  { id: 'graphic_design', label: 'Graphic Designer', baseRisk: 75, reason: "Image generation models are replacing asset creation." },
  { id: 'data_entry', label: 'Data Entry / Admin', baseRisk: 90, reason: "Highly susceptible to RPA and simple scripting." },
  { id: 'pm', label: 'Product Manager', baseRisk: 30, reason: "Strategic context and human alignment are hard to simulate." },
  { id: 'sales', label: 'Sales / BizDev', baseRisk: 25, reason: "Human trust and negotiation are high-friction for AI." },
  { id: 'cust_support', label: 'Customer Support', baseRisk: 80, reason: "Chatbots are handling tier-1/2 queries effectively." },
  { id: 'marketing', label: 'Digital Marketer', baseRisk: 55, reason: "Ad-tech and optimization are increasingly algorithmic." },
  { id: 'hr', label: 'HR / Recruiter', baseRisk: 50, reason: "Sourcing is automated; relationship management is not." },
  { id: 'legal', label: 'Paralegal / Legal Aide', baseRisk: 65, reason: "Document review is a prime target for LLMs." },
];

const SKILLS = [
  { id: 'coding', label: 'Coding (Polyglot)', riskMod: -5 },
  { id: 'strategic', label: 'Strategic Planning', riskMod: -15 },
  { id: 'creative', label: 'Creative Direction', riskMod: -10 },
  { id: 'negotiation', label: 'Negotiation', riskMod: -20 },
  { id: 'people', label: 'People Management', riskMod: -15 },
  { id: 'excel', label: 'Advanced Excel/Data', riskMod: 0 }, // Commoditized
  { id: 'prompt', label: 'AI Prompting', riskMod: -5 },
  { id: 'crisis', label: 'Crisis Management', riskMod: -20 },
];

const REGIONS = [
  { id: 'us', label: 'United States (High CoL)', riskMod: 15 }, // Outsourcing risk
  { id: 'weu', label: 'Western Europe', riskMod: 10 },
  { id: 'asia', label: 'Asia (Emerging)', riskMod: -5 }, // Often the destination of outsourcing
  { id: 'latam', label: 'LatAm', riskMod: -5 },
  { id: 'eeu', label: 'Eastern Europe', riskMod: -5 },
];

const EXPERIENCE = [
  { id: 'junior', label: 'Junior / Entry (< 2 yrs)', riskMod: 15 },
  { id: 'mid', label: 'Mid-Level (2-5 yrs)', riskMod: 0 },
  { id: 'senior', label: 'Senior / Lead (5+ yrs)', riskMod: -15 },
];

export default function App() {
  const [step, setStep] = useState(0); // 0: Input, 1: Calc, 2: Result
  const [formData, setFormData] = useState({
    role: ROLES[0].id,
    skills: [],
    region: REGIONS[0].id,
    experience: EXPERIENCE[1].id
  });
  const [result, setResult] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // --- LOGIC ---

  const handleSkillToggle = (skillId) => {
    setFormData(prev => {
      if (prev.skills.includes(skillId)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skillId) };
      }
      if (prev.skills.length >= 3) return prev; // Max 3 skills
      return { ...prev, skills: [...prev.skills, skillId] };
    });
  };

  const calculateScore = () => {
    setStep(1);
    let progress = 0;
    
    // Fake processing delay for dramatic effect
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15);
      if (progress >= 100) {
        clearInterval(interval);
        finalizeCalculation();
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 250);
  };

  const finalizeCalculation = () => {
    const role = ROLES.find(r => r.id === formData.role);
    const region = REGIONS.find(r => r.id === formData.region);
    const exp = EXPERIENCE.find(r => r.id === formData.experience);
    
    let score = role.baseRisk;
    score += region.riskMod;
    score += exp.riskMod;
    
    // Apply skill mitigations
    formData.skills.forEach(skillId => {
      const skill = SKILLS.find(s => s.id === skillId);
      score += skill.riskMod;
    });

    // Clamp score
    score = Math.max(5, Math.min(98, score));

    // Generate Verdicts & Reasons
    let verdict = "Moderate Risk";
    let color = "text-yellow-500";
    let bgColor = "bg-yellow-500/10";
    
    if (score < 30) {
      verdict = "Irreplaceable";
      color = "text-emerald-500";
      bgColor = "bg-emerald-500/10";
    } else if (score > 70) {
      verdict = "Highly Expendable";
      color = "text-red-500";
      bgColor = "bg-red-500/10";
    }

    const reasons = [
      role.reason,
      region.riskMod > 0 ? "Geographic arbitrage makes your role a target for outsourcing." : "Your location offers some cost-competitive protection.",
      exp.id === 'junior' ? "Lack of experience makes you an easy target for AI agents." : "Deep context is your primary defense shield."
    ];

    setResult({ score, verdict, reasons, color, bgColor });
    setStep(2);
  };

  const copyResult = () => {
    const text = `🚨 I just calculated my Career Replaceability Score.\n\nScore: ${result.score}/100 (${result.verdict})\n\nFind out if you're obsolete: [Link Here]`;
    navigator.clipboard.writeText(text);
    alert("Result copied to clipboard!");
  };

  // --- RENDERERS ---

  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <Terminal size={48} className="text-emerald-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-mono font-bold">Analyzing market vectors...</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-500 uppercase">
              <span>Automation Index</span>
              <span>{loadingProgress}%</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-600 font-mono pt-2">
              Processing global labor arbitrage data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2 && result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans selection:bg-emerald-500/30">
        <div className="max-w-xl mx-auto py-12">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background noise texture simulation */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

            <div className="relative z-10 text-center space-y-6">
              <div className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500">
                Replaceability Index
              </div>
              
              <div className="flex justify-center items-end gap-2">
                <span className={`text-8xl font-black tracking-tighter ${result.color}`}>
                  {result.score}
                </span>
                <span className="text-2xl font-bold text-slate-600 mb-4">/100</span>
              </div>

              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border ${result.color.replace('text', 'border')} ${result.bgColor}`}>
                {result.verdict}
              </div>

              <div className="h-px bg-slate-800 my-8"></div>

              <div className="text-left space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert size={16} /> Analysis
                </h3>
                <ul className="space-y-3">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                      <TrendingDown className="shrink-0 mt-0.5 text-slate-600" size={16} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-slate-800 my-8"></div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => setStep(0)}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw size={16} /> Recalculate
                </button>
                <button 
                  onClick={copyResult}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02]"
                >
                  <Share2 size={16} /> Share Result
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs mt-8 max-w-sm mx-auto">
            This tool uses heuristic modeling based on current AI capabilities and labor market trends. It is an estimate, not a prophecy.
          </p>
        </div>
      </div>
    );
  }

  // --- INPUT STEP ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-xl mb-4">
            <Cpu size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Replaceable</span> Are You?
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            The market is shifting. AI, geo-arbitrage, and saturation are real.
            Calculate your obsolescence risk score.
          </p>
        </header>

        <div className="space-y-8 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
          
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wide">
              <Briefcase size={16} /> Select your Role
            </label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              {ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Region Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wide">
              <Globe size={16} /> Where are you based?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {REGIONS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setFormData({...formData, region: r.id})}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    formData.region === r.id 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
             <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wide">
              <Award size={16} /> Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE.map(e => (
                <button
                  key={e.id}
                  onClick={() => setFormData({...formData, experience: e.id})}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    formData.experience === e.id 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {e.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

           {/* Skills Selection */}
           <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wide">
                <CheckCircle2 size={16} /> Top 3 Skills
              </label>
              <span className="text-xs text-slate-600 font-mono">
                {formData.skills.length}/3 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSkillToggle(s.id)}
                  disabled={!formData.skills.includes(s.id) && formData.skills.length >= 3}
                  className={`px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                    formData.skills.includes(s.id)
                      ? 'bg-emerald-500 text-slate-900 border-emerald-500' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateScore}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 mt-8"
          >
            CALCULATE RISK
          </button>

        </div>
      </div>
    </div>
  );
} 
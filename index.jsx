import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Globe, 
  Award, 
  Cpu, 
  CheckCircle2, 
  Share2, 
  RefreshCw,
  Terminal,
  ShieldAlert,
  TrendingDown,
  Languages
} from 'lucide-react';

// --- TRANSLATIONS & DATA ---

const TRANSLATIONS = {
  en: {
    title: "REPLACEABLE?",
    subtitle: "Calculate your career obsolescence risk score based on AI & market vectors.",
    role: "Job Role",
    region: "Region",
    exp: "Experience",
    skills: "Key Skills (Max 3)",
    calculate: "Run Analysis",
    analyzing: "ANALYZING MARKET VECTORS...",
    calc_step: "Calculating Exposure",
    risk_index: "Calculated Risk Index",
    risk_factors: "Risk Factors",
    retry: "Retry",
    share: "Share Score",
    copied: "Copied to clipboard!",
    verdict_low: "Hard to Replace",
    verdict_mid: "Moderate Risk",
    verdict_high: "High Obsolescence Risk",
    reason_region_high: "Your high Cost-of-Living location makes you a target for outsourcing.",
    reason_region_low: "Your location offers some cost-competitive protection against displacement.",
    reason_exp_low: "Lack of deep institutional knowledge makes you vulnerable to AI agents.",
    reason_exp_high: "Your experience provides a context shield that AI struggles to replicate.",
    share_text: "🚨 Career Replaceability Score: {score}/100\n\nVerdict: {verdict}\n\nCheck your risk level: [Link]",
    selected: "selected"
  },
  bn: {
    title: "আপনি কি প্রতিস্থাপনযোগ্য?",
    subtitle: "AI এবং বর্তমান বাজার পরিস্থিতির উপর ভিত্তি করে আপনার চাকরির ঝুঁকির স্কোর যাচাই করুন।",
    role: "আপনার পেশা / রোল",
    region: "আপনার অবস্থান (রিজিয়ন)",
    exp: "কাজের অভিজ্ঞতা",
    skills: "মূল দক্ষতা (সর্বোচ্চ ৩টি)",
    calculate: "ঝুঁকি যাচাই করুন",
    analyzing: "বাজার বিশ্লেষণ করা হচ্ছে...",
    calc_step: "এক্সপোজার নির্ণয় হচ্ছে",
    risk_index: "রিস্ক ইনডেক্স",
    risk_factors: "ঝুঁকির কারণসমূহ",
    retry: "পুনরায় চেষ্টা করুন",
    share: "শেয়ার করুন",
    copied: "ক্লিপবোর্ডে কপি করা হয়েছে!",
    verdict_low: "প্রতিস্থাপন করা কঠিন",
    verdict_mid: "মাঝারি ঝুঁকি",
    verdict_high: "উচ্চ ঝুঁকি",
    reason_region_high: "আপনার অবস্থানে জীবনযাত্রার খরচ বেশি হওয়ায় আউটসোর্সিংয়ের ঝুঁকি রয়েছে।",
    reason_region_low: "আপনার অবস্থানের খরচ কম হওয়ায় আপনি আউটসোর্সিং থেকে কিছুটা সুরক্ষিত।",
    reason_exp_low: "গভীর প্রাতিষ্ঠানিক জ্ঞানের অভাবে AI দ্বারা আপনার কাজ সহজেই করা সম্ভব।",
    reason_exp_high: "আপনার দীর্ঘ অভিজ্ঞতা আপনাকে AI-এর সহজলভ্য বিকল্প হওয়া থেকে রক্ষা করবে।",
    share_text: "🚨 আমার ক্যারিয়ার রিপ্লেসেবিলিটি স্কোর: {score}/100\n\nফলাফল: {verdict}\n\nআপনার ঝুঁকি যাচাই করুন: [লিঙ্ক]",
    selected: "নির্বাচিত"
  }
};

const ROLES = [
  { 
    id: 'swe_fe', 
    baseRisk: 45,
    label: { en: 'Frontend Developer', bn: 'ফ্রন্টএন্ড ডেভেলপার' },
    reason: { en: "AI acts as a force multiplier, reducing headcount needs.", bn: "AI একটি শক্তিশালী হাতিয়ার হিসেবে কাজ করছে, যা জনবল কমাচ্ছে।" }
  },
  { 
    id: 'swe_be', 
    baseRisk: 40,
    label: { en: 'Backend Developer', bn: 'ব্যাকএন্ড ডেভেলপার' },
    reason: { en: "Boilerplate logic is easily automated; architecture is not.", bn: "সাধারণ কোড অটোমেট করা সহজ, কিন্তু আর্কিটেকচার তৈরি করা কঠিন।" }
  },
  { 
    id: 'copywriter', 
    baseRisk: 85,
    label: { en: 'Copywriter / Content', bn: 'কপিরাইটার / কন্টেন্ট রাইটার' },
    reason: { en: "LLMs have successfully commoditized average-tier writing.", bn: "LLM সাধারণ মানের লেখাকে সহজলভ্য পণ্যে পরিণত করেছে।" }
  },
  { 
    id: 'graphic_design', 
    baseRisk: 75,
    label: { en: 'Graphic Designer', bn: 'গ্রাফিক ডিজাইনার' },
    reason: { en: "Generative media models are replacing asset creation workflows.", bn: "জেনারেটিভ মিডিয়া মডেলগুলো অ্যাসেট তৈরির কাজ দখল করে নিচ্ছে।" }
  },
  { 
    id: 'data_entry', 
    baseRisk: 95,
    label: { en: 'Data Entry / Admin', bn: 'ডাটা এন্ট্রি / অ্যাডমিন' },
    reason: { en: "RPA and AI agents are specifically designed to eliminate this role.", bn: "RPA এবং AI এজেন্ট তৈরিই হয়েছে এই ধরনের কাজ বিলুপ্ত করার জন্য।" }
  },
  { 
    id: 'pm', 
    baseRisk: 30,
    label: { en: 'Product Manager', bn: 'প্রোডাক্ট ম্যানেজার' },
    reason: { en: "Ambiguity navigation and stakeholder alignment are hard to simulate.", bn: "অনিশ্চয়তা মোকাবেলা এবং স্টেকহোল্ডারদের ম্যানেজ করা AI-এর পক্ষে কঠিন।" }
  },
  { 
    id: 'sales', 
    baseRisk: 25,
    label: { en: 'Sales / BizDev', bn: 'সেলস / বিজনেস ডেভেলপমেন্ট' },
    reason: { en: "High-stakes trust and human negotiation remain AI-resistant.", bn: "উচ্চ-পর্যায়ের বিশ্বাস এবং মানবিক দরকষাকষি এখনো AI-এর আওতার বাইরে।" }
  },
  { 
    id: 'cust_support', 
    baseRisk: 80,
    label: { en: 'Customer Support', bn: 'কাস্টমার সাপোর্ট' },
    reason: { en: "Tier 1 & 2 queries are already being handled by automated agents.", bn: "প্রাথমিক ধাপের সব প্রশ্ন এখন অটোমেটেড এজেন্টরাই সমাধান করছে।" }
  },
  { 
    id: 'marketing', 
    baseRisk: 55,
    label: { en: 'Digital Marketer', bn: 'ডিজিটাল মার্কেটার' },
    reason: { en: "Optimization and ad-ops are increasingly algorithmic.", bn: "অপটিমাইজেশন এবং অ্যাড-অপারেশন এখন পুরোপুরি অ্যালগোরিদম নির্ভর।" }
  },
  { 
    id: 'hr', 
    baseRisk: 50,
    label: { en: 'HR / Recruiter', bn: 'HR / রিক্রুটার' },
    reason: { en: "Sourcing is automated; human relationship management is safe.", bn: "কর্মী খোঁজার কাজ অটোমেটেড হলেও মানবিক সম্পর্ক ম্যানেজমেন্ট নিরাপদ।" }
  },
  { 
    id: 'legal', 
    baseRisk: 65,
    label: { en: 'Paralegal / Legal Aide', bn: 'প্যারালেগাল / লিগ্যাল এইড' },
    reason: { en: "Document review and summarization are prime LLM use-cases.", bn: "ডকুমেন্ট রিভিউ এবং সারসংক্ষেপ তৈরি এখন LLM-এর প্রধান কাজ।" }
  },
];

const SKILLS = [
  { id: 'coding', label: { en: 'Full-Stack Coding', bn: 'ফুল-স্ট্যাক কোডিং' }, riskMod: -5 },
  { id: 'strategic', label: { en: 'Strategic Planning', bn: 'কৌশলগত পরিকল্পনা' }, riskMod: -15 },
  { id: 'creative', label: { en: 'Creative Direction', bn: 'ক্রিয়েটিভ ডিরেকশন' }, riskMod: -10 },
  { id: 'negotiation', label: { en: 'High-Stakes Negotiation', bn: 'জটিল নেগোসিয়েশন' }, riskMod: -20 },
  { id: 'people', label: { en: 'People Management', bn: 'টিম ম্যানেজমেন্ট' }, riskMod: -15 },
  { id: 'excel', label: { en: 'Advanced Excel/Data', bn: 'অ্যাডভান্সড এক্সেল/ডাটা' }, riskMod: 0 }, 
  { id: 'prompt', label: { en: 'AI/LLM Prompting', bn: 'AI/LLM প্রম্পটিং' }, riskMod: -5 },
  { id: 'crisis', label: { en: 'Crisis Management', bn: 'ক্রাইসিস ম্যানেজমেন্ট' }, riskMod: -20 },
];

const REGIONS = [
  { id: 'us', label: { en: 'United States (High CoL)', bn: 'যুক্তরাষ্ট্র (উচ্চ খরচ)' }, riskMod: 15 },
  { id: 'weu', label: { en: 'Western Europe', bn: 'পশ্চিম ইউরোপ' }, riskMod: 10 },
  { id: 'asia', label: { en: 'Asia (Emerging)', bn: 'এশিয়া (উদীয়মান)' }, riskMod: -5 },
  { id: 'latam', label: { en: 'LatAm', bn: 'লাতিন আমেরিকা' }, riskMod: -5 },
  { id: 'eeu', label: { en: 'Eastern Europe', bn: 'পূর্ব ইউরোপ' }, riskMod: -5 },
];

const EXPERIENCE = [
  { id: 'junior', label: { en: 'Junior / Entry (< 2 yrs)', bn: 'জুনিয়র / এন্ট্রি (< ২ বছর)' }, riskMod: 15 },
  { id: 'mid', label: { en: 'Mid-Level (2-5 yrs)', bn: 'মিড-লেভেল (২-৫ বছর)' }, riskMod: 0 },
  { id: 'senior', label: { en: 'Senior / Lead (5+ yrs)', bn: 'সিনিয়র / লিড (৫+ বছর)' }, riskMod: -15 },
];

export default function App() {
  // --- STATE ---
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(0); // 0: Input, 1: Loading, 2: Result
  const [formData, setFormData] = useState({
    role: ROLES[0].id,
    skills: [],
    region: REGIONS[0].id,
    experience: EXPERIENCE[1].id
  });
  const [result, setResult] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // --- LANGUAGE INIT ---
  useEffect(() => {
    // 1. Check LocalStorage
    const storedLang = localStorage.getItem('app_lang');
    if (storedLang) {
      setLang(storedLang);
      return;
    }

    // 2. IP Detection (Fallback to EN on failure)
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/country/');
        if (response.ok) {
          const countryCode = await response.text();
          if (countryCode.trim() === 'BD') {
            setLang('bn');
          }
        }
      } catch (error) {
        console.log("Geo-IP detection failed, defaulting to EN");
      }
    };

    detectCountry();
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  // Helper for UI Text
  const t = (key) => TRANSLATIONS[lang][key];

  // --- ACTIONS ---

  const handleSkillToggle = (skillId) => {
    setFormData(prev => {
      if (prev.skills.includes(skillId)) return { ...prev, skills: prev.skills.filter(s => s !== skillId) };
      if (prev.skills.length >= 3) return prev; 
      return { ...prev, skills: [...prev.skills, skillId] };
    });
  };

  const calculateScore = () => {
    setStep(1);
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        finalizeCalculation();
      } else {
        setLoadingProgress(progress);
      }
    }, 150);
  };

  const finalizeCalculation = () => {
    const role = ROLES.find(r => r.id === formData.role);
    const region = REGIONS.find(r => r.id === formData.region);
    const exp = EXPERIENCE.find(r => r.id === formData.experience);
    
    let score = role.baseRisk + region.riskMod + exp.riskMod;
    
    formData.skills.forEach(skillId => {
      const skill = SKILLS.find(s => s.id === skillId);
      score += skill.riskMod;
    });

    score = Math.max(5, Math.min(99, score));

    // Verdict Logic
    let verdictKey = "verdict_mid";
    let color = "text-yellow-500";
    let bgColor = "bg-yellow-500/10";
    let borderColor = "border-yellow-500/50";
    
    if (score < 35) {
      verdictKey = "verdict_low";
      color = "text-emerald-500";
      bgColor = "bg-emerald-500/10";
      borderColor = "border-emerald-500/50";
    } else if (score > 75) {
      verdictKey = "verdict_high";
      color = "text-red-500";
      bgColor = "bg-red-500/10";
      borderColor = "border-red-500/50";
    }

    // Dynamic Reasons
    const reasons = [
      role.reason[lang], // Localized reason
      region.riskMod > 0 ? t('reason_region_high') : t('reason_region_low'),
      exp.id === 'junior' ? t('reason_exp_low') : t('reason_exp_high')
    ];

    setResult({ score, verdictKey, reasons, color, bgColor, borderColor });
    setStep(2);
  };

  const copyResult = () => {
    const verdict = t(result.verdictKey);
    const text = t('share_text')
      .replace('{score}', result.score)
      .replace('{verdict}', verdict);
    
    navigator.clipboard.writeText(text);
    alert(t('copied')); 
  };

  // --- RENDERERS ---

  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Terminal size={48} className="text-emerald-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-mono font-bold tracking-tight">{t('analyzing')}</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-500 uppercase">
              <span>{t('calc_step')}</span>
              <span>{loadingProgress}%</span>
            </div>
            <div className="h-1 bg-slate-900 w-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-200 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2 && result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans flex items-center justify-center">
        <div className="w-full max-w-md">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative z-10 text-center space-y-8">
              
              <div className="space-y-2">
                <div className="uppercase tracking-widest text-[10px] font-bold text-slate-500">
                  {t('risk_index')}
                </div>
                <div className="flex justify-center items-baseline gap-1">
                  <span className={`text-8xl font-black tracking-tighter leading-none ${result.color}`}>
                    {result.score}
                  </span>
                  <span className="text-xl font-bold text-slate-600">/100</span>
                </div>
              </div>

              <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider border ${result.borderColor} ${result.color} ${result.bgColor}`}>
                {t(result.verdictKey)}
              </div>

              <div className="text-left space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert size={14} /> {t('risk_factors')}
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

              <div className="grid grid-cols-2 gap-3 pt-4">
                 <button 
                  onClick={() => setStep(0)}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw size={16} /> {t('retry')}
                </button>
                <button 
                  onClick={copyResult}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                >
                  <Share2 size={16} /> {t('share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- INPUT STEP ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex items-center justify-center relative">
      
      {/* LANGUAGE TOGGLE */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-slate-600 transition-all z-50"
      >
        <Languages size={14} />
        <span className={lang === 'en' ? 'text-emerald-500' : ''}>EN</span>
        <span className="text-slate-700">|</span>
        <span className={lang === 'bn' ? 'text-emerald-500' : ''}>বাংলা</span>
      </button>

      <div className="w-full max-w-xl">
        
        <header className="mb-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
            <Cpu size={28} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
            {t('title')}
          </h1>
          <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </header>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm space-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Briefcase size={14} /> {t('role')}
            </label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              {ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.label[lang]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Globe size={14} /> {t('region')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {REGIONS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setFormData({...formData, region: r.id})}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all border ${
                    formData.region === r.id 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {r.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
             <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Award size={14} /> {t('exp')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE.map(e => (
                <button
                  key={e.id}
                  onClick={() => setFormData({...formData, experience: e.id})}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all border ${
                    formData.experience === e.id 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {e.label[lang].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

           <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <CheckCircle2 size={14} /> {t('skills')}
              </label>
              <span className="text-[10px] text-slate-600 font-mono">
                {formData.skills.length}/3
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSkillToggle(s.id)}
                  disabled={!formData.skills.includes(s.id) && formData.skills.length >= 3}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    formData.skills.includes(s.id)
                      ? 'bg-emerald-500 text-slate-900 border-emerald-500' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 disabled:opacity-30'
                  }`}
                >
                  {s.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateScore}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 mt-4"
          >
            {t('calculate')}
          </button>

        </div>
      </div>
    </div>
  );
}
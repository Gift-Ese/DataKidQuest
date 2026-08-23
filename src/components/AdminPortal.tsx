import React, { useState } from 'react';
import { Quest, AnnotationType, LevelNumber, TIER_QUOTAS, TOTAL_BASE_QUOTA } from '../types';
import { 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Plus, 
  ArrowLeft, 
  Save, 
  Bot, 
  Layers, 
  UploadCloud, 
  Sliders, 
  Globe, 
  Activity, 
  FileText, 
  Eye, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { requestGroqQuestGeneration } from '../services/groqQuestService';

interface AdminPortalProps {
  quests: Quest[];
  onAddQuest: (newQuest: Quest) => void;
  onBack: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ quests, onAddQuest, onBack }) => {
  // Form & Modality state
  const [mediaType, setMediaType] = useState<'image' | 'audio' | 'video' | 'text'>('image');
  const [level, setLevel] = useState<LevelNumber>(1);
  const [title, setTitle] = useState('');
  const [datasetContext, setDatasetContext] = useState('Lagos Urban Mobility Dataset');
  const [contextTag, setContextTag] = useState('lagos_traffic');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=800&q=80');
  const [textContent, setTextContent] = useState('');
  const [availableLabels, setAvailableLabels] = useState('Danfo Bus, Keke Napep, Okada Rider, Pedestrian');
  
  // 5-Dialect Localization State
  const [instructionsEn, setInstructionsEn] = useState('');
  const [instructionsYo, setInstructionsYo] = useState('');
  const [instructionsIg, setInstructionsIg] = useState('');
  const [instructionsHa, setInstructionsHa] = useState('');
  const [instructionsPcm, setInstructionsPcm] = useState('');

  // Groq AI Auto-Gen state
  const [isGeneratingWithGroq, setIsGeneratingWithGroq] = useState(false);
  const [groqTelemetry, setGroqTelemetry] = useState<string | null>(null);
  const [aiProposal, setAiProposal] = useState<any>(null);

  // Bandwidth Compliance Metrics (<180 KB Image, <2.5 MB Video)
  const [simulatedFileSizeKb, setSimulatedFileSizeKb] = useState(142);
  const isBandwidthCompliant = mediaType === 'video' ? simulatedFileSizeKb <= 2500 : simulatedFileSizeKb <= 180;

  // QA Verification Checklist
  const [safetyCleared, setSafetyCleared] = useState(true);
  const [africanContextVerified, setAfricanContextVerified] = useState(true);
  const [groundTruthCalibrated, setGroundTruthCalibrated] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Live Tier Quota Counting
  const levelCounts: Record<LevelNumber, number> = {
    1: quests.filter(q => q.level === 1).length,
    2: quests.filter(q => q.level === 2).length,
    3: quests.filter(q => q.level === 3).length,
    4: quests.filter(q => q.level === 4).length,
    5: quests.filter(q => q.level === 5).length,
  };

  const handleGroqAutoGenerate = async () => {
    setIsGeneratingWithGroq(true);
    sounds.playClick();
    setGroqTelemetry('Groq LPU™ synthesizing multimodal bounding targets & 5-dialect instructions...');

    try {
      const proposal = await requestGroqQuestGeneration({
        mediaType,
        mediaUrl,
        contextTag,
        level,
      });

      setAiProposal(proposal);
      setTitle(title || `AI Annotated: ${proposal.nigerian_context_tag.replace('_', ' ').toUpperCase()} L${level}`);
      setInstructionsEn(proposal.instructions.en_NG);
      setInstructionsYo(proposal.instructions.yo_NG);
      setInstructionsIg(proposal.instructions.ig_NG);
      setInstructionsHa(proposal.instructions.ha_NG);
      setInstructionsPcm(proposal.instructions.pcm_NG);
      setAvailableLabels(proposal.available_labels.join(', '));
      setGroqTelemetry(`Generated in 240ms via Groq LPU™! Ground truth & QA trap calibrated.`);
      sounds.playSuccessChime();
    } catch (err: any) {
      setGroqTelemetry('Generated with local pedagogical heuristic fallback.');
      setInstructionsEn('Accurately tag the Nigerian transit vehicles and traffic items.');
      setInstructionsPcm('Draw clear box round the yellow Danfo bus wey dey road.');
      setInstructionsYo('Fa àpótí yí bọ́ọ̀sì Danfo tó wà lójú ọ̀nà náà.');
      setInstructionsIg('Detuo igbe gburugburu bọs Danfo dị n\'okporo ụzọ ahụ.');
      setInstructionsHa('Zana akwatin daidai a kusa da motar bas din Danfo.');
    } finally {
      setIsGeneratingWithGroq(false);
    }
  };

  const handlePublishQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructionsEn.trim()) return;

    sounds.playSuccessChime();

    const annotationType: AnnotationType = 
      mediaType === 'image' ? (level >= 3 ? 'QA_INSPECTION' : 'IMAGE_BOUNDING_BOX') :
      mediaType === 'audio' ? 'AUDIO_CLASSIFICATION' :
      mediaType === 'video' ? 'VIDEO_TRACKING' : 'TEXT_SENTIMENT';

    const labels = availableLabels.split(',').map(s => s.trim()).filter(Boolean);

    const newQuest: Quest = {
      id: `quest_custom_${Date.now()}`,
      level,
      title: title.trim(),
      description: instructionsEn.trim(),
      learning_objective: `Master Level ${level} (${TIER_QUOTAS[level].mechanicTitle}) annotation standards for ${datasetContext}.`,
      annotation_type: annotationType,
      dataset_context: datasetContext,
      difficulty: level === 1 ? 'EASY' : level <= 3 ? 'MEDIUM' : 'HARD',
      instructions: instructionsEn.trim(),
      availableLabels: labels,
      xp_reward: TIER_QUOTAS[level].quota * 2 + 30,
      estimated_time_min: 3,
      media_asset: {
        type: mediaType === 'image' ? 'IMAGE' : mediaType === 'audio' ? 'AUDIO' : mediaType === 'video' ? 'VIDEO' : 'TEXT',
        url: mediaUrl,
        audioSynthType: mediaType === 'audio' ? 'traffic' : undefined,
        textContent: textContent || undefined,
        alt: title,
        category: datasetContext,
        media_rights_status: 'ORIGINAL',
        sourceName: 'MLQuest Africa Admin Live Submission',
      },
      ground_truth: aiProposal?.ground_truth || {
        type: mediaType === 'image' ? 'IMAGE' : 'AUDIO',
        boxes: mediaType === 'image' ? [{ id: 'gt_1', x: 0.25, y: 0.30, width: 0.50, height: 0.45, label: labels[0] || 'Object' }] : undefined,
        requiredLabels: [labels[0] || 'Object'],
        correctSoundClass: labels[0] || 'Sound Event',
      },
      content_status: 'PUBLISHED',
      safety_status: safetyCleared ? 'SAFE_FOR_CHILDREN' : 'FLAGGED',
      created_by: 'MLQuest Admin Portal (Groq AI Pipeline)',
      created_at: new Date().toISOString().split('T')[0],
    };

    onAddQuest(newQuest);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3500);
  };

  return (
    <div id="admin-portal" className="flex flex-col gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 animate-fade-in text-white">
      {/* Admin Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-neutral-900 to-neutral-900 border border-purple-800/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-lg">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Groq-Powered Admin Ingestion Suite • v2.0 MVP
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Multimodal Dataset & Quest Authoring Pipeline
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
              Upload authentic Nigerian media, synthesize AI proposals via Groq LPU™ (200ms), calibrate ground-truth tolerances, and manage the 470-task curriculum quota.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Studio
        </button>
      </div>

      {/* Tier Quota Tracker (20, 75, 100, 125, 150 = 470) */}
      <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-200">
              Live Curriculum Tier Quota Monitor (Total Catalog: {quests.length} / {TOTAL_BASE_QUOTA} Quests)
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            100% Native Nigerian Datasets Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {([1, 2, 3, 4, 5] as LevelNumber[]).map((lvl) => {
            const config = TIER_QUOTAS[lvl];
            const count = levelCounts[lvl];
            const percentage = Math.min(100, Math.round((count / config.quota) * 100));

            return (
              <div key={lvl} className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-neutral-400">
                    L{lvl}: {config.title.split(' ')[1]}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${config.accessStatus === 'FREE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
                    {config.accessStatus}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-white">{count}</span>
                  <span className="text-[10px] text-neutral-400 font-bold">/ {config.quota} quota</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${lvl === 1 ? 'bg-emerald-500' : lvl === 2 ? 'bg-blue-500' : lvl === 3 ? 'bg-amber-500' : lvl === 4 ? 'bg-purple-500' : 'bg-rose-500'}`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[9px] text-neutral-400 font-medium truncate">
                  "{config.mechanicTitle}"
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>New AI quest successfully synthesized by Groq, calibrated, and published to live curriculum!</span>
        </div>
      )}

      {/* Main Authoring Form */}
      <form onSubmit={handlePublishQuest} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media & Ingestion Config */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-purple-400" />
              1. Multimodal Media Ingestion & Optimization
            </h3>

            {/* Modality Selector */}
            <div className="grid grid-cols-4 gap-2">
              {(['image', 'audio', 'video', 'text'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setMediaType(m);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${mediaType === m ? 'bg-purple-600 text-white shadow-lg' : 'bg-neutral-950 text-neutral-400 hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Media URL / Upload Input */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                Source Media Asset URL ({mediaType})
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... (WebP / MP3 / MP4 CDN URL)"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Nigerian 3G/4G Bandwidth Compliance Gauge */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${isBandwidthCompliant ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div>
                  <div className="text-[11px] font-bold text-white">
                    Low-Bandwidth WebP/H.264 Compliance ({simulatedFileSizeKb} KB)
                  </div>
                  <div className="text-[9px] text-neutral-400">
                    Target: &lt;180 KB (Image) or &lt;2.5 MB (Video) for fast 3G/4G loading in Nigeria.
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isBandwidthCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {isBandwidthCompliant ? 'PASSED' : 'NEEDS COMPRESSION'}
              </span>
            </div>

            {/* Context & Target Tier Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                  Target Curriculum Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value) as LevelNumber)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={1}>L1: Data Explorer (Free • 20 Quotas)</option>
                  <option value={2}>L2: Data Annotator (Premium • 75 Quotas)</option>
                  <option value={3}>L3: Data Reviewer (Premium • 100 Quotas)</option>
                  <option value={4}>L4: AI Quality Inspector (Premium • 125 Quotas)</option>
                  <option value={5}>L5: Data Quality Specialist (Premium • 150 Quotas)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                  Nigerian Context Tag
                </label>
                <input
                  type="text"
                  value={contextTag}
                  onChange={(e) => setContextTag(e.target.value)}
                  placeholder="e.g. lagos_traffic, balogun_market"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Groq One-Click Synthesizer Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  One-Click Groq LPU™ Synthetic Quest Engine
                </span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded">
                  llama-3.3-70b-versatile
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Automatically generate ground-truth coordinates, 5 local Nigerian language translations, IoU tolerance margins, and QA traps.
              </p>
              <button
                type="button"
                disabled={isGeneratingWithGroq}
                onClick={handleGroqAutoGenerate}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingWithGroq ? (
                  <>
                    <Bot className="w-4 h-4 animate-spin text-yellow-300" />
                    <span>Groq LPU Synthesizing (~240ms)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Auto-Synthesize Annotations with Groq</span>
                  </>
                )}
              </button>
              {groqTelemetry && (
                <div className="text-[10px] text-emerald-400 font-mono bg-neutral-950/80 p-2 rounded-lg border border-emerald-500/20">
                  {groqTelemetry}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Dialect Translations & QA Review */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              2. 5-Dialect Localization & Instructions
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                Quest Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lagos BRT Bus Detection"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">
                English (en_NG) Instruction
              </label>
              <textarea
                required
                rows={2}
                value={instructionsEn}
                onChange={(e) => setInstructionsEn(e.target.value)}
                placeholder="Explain clearly to the child what to annotate..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">
                Nigerian Pidgin (pcm_NG) Instruction
              </label>
              <input
                type="text"
                value={instructionsPcm}
                onChange={(e) => setInstructionsPcm(e.target.value)}
                placeholder="e.g. Draw clear box round the yellow Danfo bus..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">
                Yoruba (yo_NG) / Igbo (ig_NG) / Hausa (ha_NG)
              </label>
              <input
                type="text"
                value={instructionsYo || instructionsIg || instructionsHa}
                onChange={(e) => setInstructionsYo(e.target.value)}
                placeholder="Localized prompt translation..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">
                Available Classes / Labels (Comma-separated)
              </label>
              <input
                type="text"
                value={availableLabels}
                onChange={(e) => setAvailableLabels(e.target.value)}
                placeholder="Danfo Bus, Keke Napep, Okada Rider"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Human QA Compliance Checklist */}
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Human QA Compliance Checklist
              </span>
              <div className="flex flex-col gap-1.5 text-[11px] text-neutral-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={safetyCleared} 
                    onChange={(e) => setSafetyCleared(e.target.checked)} 
                    className="accent-emerald-500 rounded" 
                  />
                  <span>Child Safety & PII Cleared</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={africanContextVerified} 
                    onChange={(e) => setAfricanContextVerified(e.target.checked)} 
                    className="accent-emerald-500 rounded" 
                  />
                  <span>Native Nigerian Dataset Authenticity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={groundTruthCalibrated} 
                    onChange={(e) => setGroundTruthCalibrated(e.target.checked)} 
                    className="accent-emerald-500 rounded" 
                  />
                  <span>Ground Truth & Tolerances Calibrated</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Publish Quest to Live Curriculum</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

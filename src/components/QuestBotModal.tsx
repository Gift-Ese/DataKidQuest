import React, { useState, useEffect } from 'react';
import { Bot, Send, X, Sparkles, HelpCircle, MessageSquare, Lightbulb, Zap, Cpu } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { getTranslation } from '../i18n/translations';
import { LanguageCode, Quest } from '../types';

interface QuestBotModalProps {
  quest?: Quest;
  language: LanguageCode;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  engine?: string;
}

export const QuestBotModal: React.FC<QuestBotModalProps> = ({ quest, language, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: getTranslation(language, 'questbot.greeting'),
      engine: 'Groq',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiBrainInfo, setAiBrainInfo] = useState<{ engine: string; model: string; speed: string } | null>(null);

  useEffect(() => {
    fetch('/api/ai-brain-info')
      .then((res) => res.json())
      .then((data) => {
        if (data) setAiBrainInfo(data);
      })
      .catch(() => {});
  }, []);

  const quickQuestions = [
    'Why was my bounding box wrong?',
    'What does IoU (Intersection over Union) mean?',
    'Why do humans need to check AI?',
    'How does AI learn from Nigerian Pidgin?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim() || isLoading) return;

    sounds.playClick();
    const newMsgs: ChatMessage[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/questbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          language,
          questContext: quest ? {
            title: quest.title,
            type: quest.annotation_type,
            objective: quest.learning_objective,
            level: quest.level,
          } : undefined,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setMessages([...newMsgs, { sender: 'bot', text: data.answer, engine: data.engine || 'Groq' }]);
      } else {
        setMessages([...newMsgs, { sender: 'bot', text: getFallbackAnswer(query), engine: 'Groq' }]);
      }
    } catch {
      setMessages([...newMsgs, { sender: 'bot', text: getFallbackAnswer(query), engine: 'Groq' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackAnswer = (q: string) => {
    const low = q.toLowerCase();
    if (low.includes('box') || low.includes('iou')) {
      return 'Great question! A bounding box tells AI the exact location (x, y, width, height) of an object. IoU measures how tightly your box matches the true edges. A snug box prevents AI from confusing background scenery with the target vehicle!';
    }
    if (low.includes('human') || low.includes('check')) {
      return 'AI is like a super-fast student, but it cannot think on its own! It learns entirely from human examples. When humans review and QA data, we fix mistakes so the AI learns the right patterns.';
    }
    if (low.includes('pidgin') || low.includes('language') || low.includes('yoruba') || low.includes('hausa') || low.includes('igbo')) {
      return 'Language AI needs local context! Words like "sweet die" in Nigerian Pidgin mean very delicious, not something bad. By labeling local dialects, we build AI that understands African people and culture!';
    }
    return 'Data annotation is like creating study flashcards for AI. Every accurate box, sound label, or text tag you create helps machines learn patterns to help doctors, farmers, and drivers across Africa!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col h-[530px] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Zap className="w-5 h-5 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  QuestBot AI Brain
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Groq LPU Engine
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Ultra-fast child-safe AI learning tutor • Llama 3.3
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 max-w-[85%] ${
                m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700/60 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'bot' && m.engine && (
                  <span className="text-[9px] text-neutral-500 font-mono px-1 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-orange-400" />
                    Powered by {m.engine} LPU
                  </span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-neutral-400 pl-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
              <span>Groq LPU AI Brain is computing response...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-neutral-950/60 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={getTranslation(language, 'questbot.placeholder')}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-all shadow cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

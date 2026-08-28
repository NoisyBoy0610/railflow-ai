'use client';

import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { aiEngine } from '@/lib/aiEngine';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(aiEngine.getApiKey() || '');
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    aiEngine.setApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    aiEngine.setApiKey('');
    setApiKey('');
    setIsSaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F2C59] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine Configuration</h3>
              <p className="text-xs text-slate-300">Dual-Mode: Built-in Mock AI + Live OpenAI API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <p className="font-semibold text-blue-950 mb-0.5">Offline-Ready Deterministic Engine Included!</p>
              RailFlow AI is fully equipped with an autonomous deterministic engine for all 10 subsystems out of the box. Adding your OpenAI key activates direct GPT-4o multimodal parsing and dynamic vision triage.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              OpenAI API Key (Optional BYOK)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="sk-proj-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Stored strictly in your local browser session storage. Never sent to any external server.
            </p>
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Key successfully saved! System now using dual-mode engine.</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={handleClear}
              type="button"
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              Reset to Built-in Engine
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

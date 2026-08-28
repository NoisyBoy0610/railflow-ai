'use client';

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, UploadCloud, FileUp } from 'lucide-react';
import { MOCK_GRIEVANCE_SAMPLES } from '@/lib/mockData';
import { aiEngine, GrievanceAIResult } from '@/lib/aiEngine';
import { soundEffects } from '@/lib/audio';

export const Subsystem10_RailMadadVision: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState(MOCK_GRIEVANCE_SAMPLES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customPnr, setCustomPnr] = useState<string>('821-4928103');
  const [customCoach, setCustomCoach] = useState<string>('B2');
  const [customBerth, setCustomBerth] = useState<string>('Berth 17');
  const [description, setDescription] = useState<string>(MOCK_GRIEVANCE_SAMPLES[0].description);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<GrievanceAIResult | null>(null);
  const [ticketToken, setTicketToken] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickSample = (sample: typeof MOCK_GRIEVANCE_SAMPLES[0]) => {
    setSelectedSample(sample);
    setUploadedImage(null);
    setDescription(sample.description);
    setCustomCoach(sample.coach);
    setCustomBerth(sample.berth);
    setCustomPnr(sample.pnr);
    setAiResult(null);
    setTicketToken('');
    soundEffects.playTick();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setUploadedImage(base64);
      setDescription(prev => prev || `Photo uploaded of issue in coach ${customCoach} ${customBerth}. Inspect cleanliness and maintenance.`);
      setAiResult(null);
      setTicketToken('');
      soundEffects.playTick();
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeGrievance = async () => {
    setIsAnalyzing(true);
    setAiResult(null);
    setTicketToken('');
    soundEffects.playTick();

    try {
      const activeImage = uploadedImage || selectedSample.sampleImage;
      const result = await aiEngine.classifyGrievanceImageAsync(selectedSample.category, description, activeImage);
      
      setAiResult(result);
      const token = 'MADAD-' + Math.floor(100000 + Math.random() * 900000);
      setTicketToken(token);

      if (result.severity === 'CRITICAL') {
        soundEffects.playAlert();
      } else {
        soundEffects.playConfirmationChime();
      }
    } catch (err) {
      console.error('Error during grievance triage:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 10
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Multimodal RailMadad Grievance Engine (Vision AI)
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Vision AI severity grading (Critical/High/Normal), automatic coach tagging, and DRM division escalation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-400/30 text-purple-300 text-xs">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Multimodal Vision & NLP</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample Issue Picker & Real Photo Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select or Upload Incident Photo:
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-[11px] font-bold border border-orange-200 flex items-center gap-1.5 transition-colors"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {uploadedImage ? (
            <div className="p-3 bg-orange-50 border border-orange-300 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                <span>📸 Custom User Photo Uploaded</span>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-[10px] text-orange-700 underline"
                >
                  Reset to presets
                </button>
              </div>
              <img
                src={uploadedImage}
                alt="User Uploaded Grievance"
                className="w-full h-36 object-cover rounded-lg border border-orange-200"
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {MOCK_GRIEVANCE_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickSample(sample)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all ${
                    selectedSample.title === sample.title
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={sample.sampleImage}
                    alt={sample.title}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                  <span className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-2">
                    {sample.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Issue Details */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block">PNR</label>
                <input
                  type="text"
                  value={customPnr}
                  onChange={(e) => setCustomPnr(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block">Coach</label>
                <input
                  type="text"
                  value={customCoach}
                  onChange={(e) => setCustomCoach(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block">Berth</label>
                <input
                  type="text"
                  value={customBerth}
                  onChange={(e) => setCustomBerth(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Passenger Description:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyzeGrievance}
            disabled={isAnalyzing}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Multimodal Vision Severity Triage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Grievance & Dispatch OBHS Token</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Triage & Resolution Token */}
        <div className="lg:col-span-7 space-y-4">
          {aiResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Severity Card */}
              <div className={`p-4 rounded-xl border ${
                aiResult.severity === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-300'
                  : aiResult.severity === 'HIGH'
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-white text-[10px] font-black uppercase ${
                      aiResult.severity === 'CRITICAL' ? 'bg-rose-600' : aiResult.severity === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600'
                    }`}>
                      {aiResult.severity} SEVERITY
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{aiResult.category}</h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">
                    SLA: Responds in {aiResult.targetResolutionMinutes} Mins
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-800 block">Detected Visual Anomalies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.detectedIssues.map((issue, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white/80 rounded border text-[11px] font-medium text-slate-700">
                        ⚠️ {issue}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">
                  <strong>Recommended Action:</strong> {aiResult.suggestedAction}
                </p>
              </div>

              {/* Resolution Token Dispatch */}
              <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs">Grievance Successfully Registered</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold rounded border border-emerald-500/30">
                    {ticketToken}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                  <p><strong>Assigned Division:</strong> {aiResult.assignedDivision}</p>
                  <p><strong>Location Tag:</strong> Coach {customCoach}, {customBerth} • PNR {customPnr}</p>
                  <p className="text-[11px] text-emerald-400">
                    Live SMS & Dispatch alert triggered to On-Board Housekeeping Superintendent.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 space-y-2">
              <Camera className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No Photo Triage Performed Yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Select an issue photo or upload your own image to run the Multimodal Vision Triage Engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

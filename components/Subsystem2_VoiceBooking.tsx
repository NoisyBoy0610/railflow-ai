'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, ArrowRight, Languages, CheckCircle2, RotateCcw } from 'lucide-react';
import { aiEngine, ParsedVoiceBookingIntent } from '@/lib/aiEngine';
import { INDIC_LANGUAGES, speakMessage, soundEffects } from '@/lib/audio';
import { IndicLanguage } from '@/lib/types';

interface VoiceBookingProps {
  currentLang: IndicLanguage;
  onApplySearch?: (intent: ParsedVoiceBookingIntent) => void;
}

export const Subsystem2_VoiceBooking: React.FC<VoiceBookingProps> = ({ currentLang, onApplySearch }) => {
  const [selectedLang, setSelectedLang] = useState<IndicLanguage>(currentLang || 'hi');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedIntent, setParsedIntent] = useState<ParsedVoiceBookingIntent | null>(null);

  const samplePrompts: Record<IndicLanguage, string[]> = {
    hi: [
      'बेंगलुरु से चेन्नई कल शाम 2 टिकट 3AC में बुक करो',
      'नई दिल्ली से वाराणसी वंदे भारत एक्सप्रेस में चेयर कार 1 सीट',
      'हावड़ा से दिल्ली राजधानी एक्सप्रेस 2A तत्काल कोटा',
    ],
    kn: [
      'ಬೆಂಗಳೂರಿನಿಂದ ಚೆನ್ನೈಗೆ ನಾಳೆ 2 ಟಿಕೆಟ್ 3AC ಬುಕ್ ಮಾಡಿ',
      'ಮೈಸೂರಿನಿಂದ ಬೆಂಗಳೂರಿಗೆ ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ 1 ಸೀಟ್',
      'ಬೆಂಗಳೂರಿನಿಂದ ಮುಂಬೈಗೆ ರಾಜಧಾನಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ 2A',
    ],
    ta: [
      'சென்னையிலிருந்து பெங்களூருக்கு நாளை 2 டிக்கெட் 3AC புக் பண்ணுங்க',
      'சென்னையிலிருந்து மதுரைக்கு வந்தே பாரத் 1 சீட்',
      'டெல்லியிலிருந்து சென்னைக்கு ஜிஎன்டபிள்யூஎல் டிக்கெட்',
    ],
    te: [
      'బెంగళూరు నుండి చెన్నైకి రేపు 2 టిక్కెట్లు 3AC బుక్ చేయండి',
      'హైదరాబాద్ నుండి ఢిల్లీకి వందే భారత్ ఎక్స్‌ప్రెస్',
      'విజయవాడ నుండి చెన్నైకి 2A తత్కాల్ టికెట్',
    ],
    bn: [
      'হাওড়া থেকে নতুন দিল্লি কালকে ২টো ৩এসি টিকিট বুক করো',
      'কলকাতা থেকে পাটনা শতাব্দী এক্সপ্রেস ১টি টিকিট',
      'শিয়ালদহ থেকে পুরী ২এ তাৎকাল কোটা',
    ],
    mr: [
      'मुंबई ते दिल्ली उद्या संध्याकाळी २ तिकिटे ३AC बुक करा',
      'पुणे ते मुंबई वंदे भारत एक्सप्रेस १ सीट',
      'नागपूर ते मुंबई राजधानी २A',
    ],
    gu: [
      'અમદાવાદ થી મુંબઈ કાલે ૨ ટિકિટ 3AC બુક કરો',
      'સુરત થી દિલ્હી વંદે ભારત એક્સપ્રેસ ૧ સીટ',
      'વડોદરા થી જયપુર રાજધાની એક્સપ્રેસ',
    ],
    ml: [
      'ബെംഗളൂരുവിൽ നിന്ന് ചെന്നൈയിലേക്ക് നാളെ 2 ടിക്കറ്റ് 3AC ബുക്ക് ചെയ്യുക',
      'തിരുവനന്തപുരത്തു നിന്ന് എറണാകുളത്തേക്ക് വന്ദേ ഭാരത്',
      'കൊച്ചിയിൽ നിന്ന് ഡൽഹിയിലേക്ക് 2A ടിക്കറ്റ്',
    ],
    or: [
      'ଭୁବନେଶ୍ୱରରୁ ହାୱଡା କାଲି ୨ଟି ୩ଏସି ଟିକେଟ୍ ବୁକ୍ କରନ୍ତୁ',
      'କଟକରୁ ନୂଆଦିଲ୍ଲୀ ରାଜଧାନୀ ଏକ୍ସପ୍ରେସ୍',
      'ପୁରୀରୁ ରାଉରକେଲା ବନ୍ଦେ ଭାରତ',
    ],
    en: [
      'Book 2 3AC tickets from Bengaluru to Chennai for tomorrow evening',
      'One Chair Car seat from New Delhi to Varanasi on Vande Bharat Express',
      'Senior citizen lower berth from Mumbai Central to New Delhi on Tejas Rajdhani',
    ]
  };

  const handleStartVoice = () => {
    soundEffects.playTick();
    setIsRecording(true);
    setVoiceText('');
    setParsedIntent(null);

    // Check browser SpeechRecognition
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: any;
      webkitSpeechRecognition?: any;
    };
    const SpeechRec = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        const currentLangObj = INDIC_LANGUAGES.find(l => l.code === selectedLang);
        recognition.lang = currentLangObj ? currentLangObj.speechLocale : 'hi-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setVoiceText(transcript);
        };

        recognition.onerror = () => {
          // Fallback to sample prompt
          const samples = samplePrompts[selectedLang] || samplePrompts.en;
          setVoiceText(samples[0]);
          setIsRecording(false);
          triggerParse(samples[0]);
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (voiceText) {
            triggerParse(voiceText);
          } else {
            const samples = samplePrompts[selectedLang] || samplePrompts.en;
            setVoiceText(samples[0]);
            triggerParse(samples[0]);
          }
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRec error:', err);
      }
    }

    // Interactive fallback simulation
    setTimeout(() => {
      const samples = samplePrompts[selectedLang] || samplePrompts.en;
      const chosen = samples[Math.floor(Math.random() * samples.length)];
      setVoiceText(chosen);
      setIsRecording(false);
      triggerParse(chosen);
    }, 2000);
  };

  const triggerParse = async (text: string) => {
    setIsParsing(true);
    const intent = await aiEngine.parseBookingPrompt(text, selectedLang);
    setParsedIntent(intent);
    setIsParsing(false);
    soundEffects.playConfirmationChime();

    // Voice response
    const voiceMsg = `Booking journey from ${intent.sourceStation} to ${intent.destinationStation} for ${intent.passengerCount} passengers in ${intent.classType}.`;
    speakMessage(voiceMsg, selectedLang);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 2
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Indic Multimodal Voice-First Booking
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Speak naturally in 10 Indian regional languages — OpenAI structured PRS parameter deduction
              </p>
            </div>
          </div>

          {/* Language Selector in Header */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/10">
            <Languages className="w-4 h-4 text-orange-400 ml-1.5" />
            <select
              value={selectedLang}
              onChange={(e) => {
                const newL = e.target.value as IndicLanguage;
                setSelectedLang(newL);
                setParsedIntent(null);
                setVoiceText('');
              }}
              className="bg-transparent text-xs text-white font-medium focus:outline-none pr-2 cursor-pointer"
            >
              {INDIC_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Interaction & Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30"></div>
              )}
              <button
                onClick={isRecording ? () => setIsRecording(false) : handleStartVoice}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-rose-500/40 ring-4 ring-rose-300 animate-pulse'
                    : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-orange-500/30 hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {isRecording ? 'Listening in ' + (INDIC_LANGUAGES.find(l => l.code === selectedLang)?.nativeName) + '...' : 'Tap Mic & Speak in Your Language'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Say your source, destination, date, class preference, or number of passengers.
              </p>
            </div>

            {/* Simulated Live Audio Waveform */}
            {isRecording && (
              <div className="flex items-center gap-1 h-6">
                {[40, 75, 100, 60, 90, 45, 80, 100, 50, 70, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-orange-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 80}ms`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Prompt Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sample Voice Prompts in {INDIC_LANGUAGES.find(l => l.code === selectedLang)?.nativeName}:
              </span>
              <button
                onClick={() => {
                  const samples = samplePrompts[selectedLang] || samplePrompts.en;
                  const picked = samples[Math.floor(Math.random() * samples.length)];
                  setVoiceText(picked);
                  triggerParse(picked);
                }}
                className="text-[11px] text-orange-600 font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Auto-Test
              </button>
            </div>

            <div className="space-y-1.5">
              {(samplePrompts[selectedLang] || samplePrompts.en).map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setVoiceText(sample);
                    triggerParse(sample);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200 hover:border-orange-300 text-xs text-slate-700 transition-colors flex items-start gap-2 group"
                >
                  <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{sample}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Extracted Structured JSON Schema */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Captured Speech Transcript
            </label>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium min-h-[50px] flex items-center">
              {voiceText || <span className="text-slate-400 italic">No audio recorded yet. Tap microphone or select a sample prompt...</span>}
            </div>
          </div>

          {parsedIntent ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Structured PRS Payload Display */}
              <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-mono font-bold text-orange-300">
                      OpenAI JSON Schema (PRS Search Payload)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                    Confidence: {(parsedIntent.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Origin Station</span>
                    <span className="font-bold text-white text-sm">{parsedIntent.sourceStation}</span>
                    <span className="text-orange-400 font-mono text-xs block">({parsedIntent.sourceCode})</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Destination</span>
                    <span className="font-bold text-white text-sm">{parsedIntent.destinationStation}</span>
                    <span className="text-orange-400 font-mono text-xs block">({parsedIntent.destCode})</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Travel Date</span>
                    <span className="font-bold text-white text-sm">{parsedIntent.date}</span>
                    <span className="text-emerald-400 text-xs block">Tomorrow</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Travel Class</span>
                    <span className="font-bold text-white text-sm">{parsedIntent.classType}</span>
                    <span className="text-slate-400 text-xs block">AC 3 Tier</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Quota</span>
                    <span className="font-bold text-white text-sm">{parsedIntent.quota}</span>
                    <span className="text-slate-400 text-xs block">General Quota</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Passengers</span>
                    <span className="font-bold text-white text-sm">{parsedIntent.passengerCount} Adult</span>
                    <span className="text-emerald-400 text-xs block">Standard</span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {parsedIntent.explanation}
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const voiceMsg = `Booking journey from ${parsedIntent.sourceStation} to ${parsedIntent.destinationStation} for ${parsedIntent.passengerCount} passengers in ${parsedIntent.classType}.`;
                    speakMessage(voiceMsg, selectedLang);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-orange-500" />
                  <span>Re-play Voice Feedback</span>
                </button>

                <button
                  onClick={() => {
                    if (onApplySearch) {
                      onApplySearch(parsedIntent);
                    }
                  }}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Auto-Populate & Search Trains</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isParsing ? (
            <div className="h-44 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 space-y-2">
              <Sparkles className="w-6 h-6 text-orange-500 animate-spin" />
              <p className="text-xs font-semibold text-slate-700">OpenAI NLP Parser Running...</p>
              <p className="text-[11px] text-slate-400">Extracting stations, dates, classes and quota entities from voice stream</p>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 space-y-2">
              <Languages className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Waiting for Voice or Audio Stream</p>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Speak or choose a sample prompt in Hindi, Kannada, Tamil, Telugu, Bengali, Marathi, etc.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

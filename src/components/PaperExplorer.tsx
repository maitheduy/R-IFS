import React, { useState } from 'react';
import { PAPER_PROOF_STEPS } from '../utils/math';
import { BookOpen, ShieldCheck, FileText, ChevronRight, CheckCircle2, Globe, ArrowRight, Award } from 'lucide-react';

export const PaperExplorer: React.FC = () => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] space-y-6">
      {/* Top Research Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  RC-000004-RIS-M0
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  PENDING_LEAN_GATE
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {language === 'vi' ? 'R-IFS hai ánh xạ sinh tam giác Sierpiński' : 'R-IFS Two-Map Generator for Sierpinski Triangle'}
              </h2>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-3xl">
            {language === 'vi'
              ? 'Nghiên cứu độc lập (F-Group) tách cấu trúc từ Example 1 của bài báo The R-IFSs and their attractors (Nguyen Viet Hung et al., 2023).'
              : 'Independent research (F-Group) isolating the structure from Example 1 of The R-IFSs and their attractors (Nguyen Viet Hung et al., 2023).'}
          </p>
        </div>

        {/* Language & PDF link */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLanguage(l => l === 'vi' ? 'en' : 'vi')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'vi' ? 'Switch to English' : 'Tiếng Việt'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & 7 Proof Steps Selector */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
          <h3 className="text-base font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>{language === 'vi' ? '7 Bước Chứng Minh Trực Tiếp' : '7 Proof Steps'}</span>
          </h3>

          <div className="space-y-2">
            {PAPER_PROOF_STEPS.map((step) => (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStep(step.stepNumber)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  activeStep === step.stepNumber
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                    activeStep === step.stepNumber ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-medium truncate">
                    {language === 'vi' ? step.titleVi : step.titleEn}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeStep === step.stepNumber ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="text-indigo-300 font-semibold flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hạt nhân lý thuyết (Core Principle):</span>
            </div>
            <p className="font-mono text-slate-300">
              contraction + finite symmetry = ordinary contraction IFS
            </p>
          </div>
        </div>

        {/* Right Column: Active Proof Step Details & Paper Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Step Card */}
          {(() => {
            const step = PAPER_PROOF_STEPS.find(s => s.stepNumber === activeStep)!;
            return (
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-indigo-600/30">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {language === 'vi' ? step.titleVi : step.titleEn}
                      </h3>
                      <p className="text-xs text-indigo-300 font-mono mt-0.5">
                        Mathematical Claim / M0 (Readable & Verifiable)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>{language === 'vi' ? step.contentVi : step.contentEn}</p>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-indigo-300 text-center tracking-wide text-sm shadow-inner">
                    {step.formula}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Research Context & Core Definitions */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h4 className="text-base font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Bối cảnh & Dữ liệu Xây dựng' : 'Context & Construction Data'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-indigo-300">1. Hệ R-IFS hai ánh xạ (R):</div>
                <p className="text-slate-300">
                  Xét mặt phẳng phức với khoảng cách Euclid. Phép quay R(z) = &omega;z (&omega; = e^(2&pi;i/3)) và phép co f(z) = z/2 + 1.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-indigo-300">2. Hệ ba ánh xạ co (F):</div>
                <p className="text-slate-300">
                  Từ R, xét ba ánh xạ g&amp;#8320; = f, g&amp;#8321; = R &amp;cir; f, g&amp;#8322; = R&amp;#178; &amp;cir; f đều có tỉ số co 1/2 tạo thành tam giác Sierpiński.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-indigo-300">Kết luận chính (Theorem):</div>
              <p className="font-mono text-center text-white py-1">
                MinInv({'{R, f}'}) = Attr({'{f, Rf, R²f}'}) = K
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

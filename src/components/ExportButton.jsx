import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, Copy, X } from 'lucide-react';
import { generateExportTXT } from '../lib/calculator';

export default function ExportButton({ report }) {
  const [generatedText, setGeneratedText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (report) {
      setGeneratedText(generateExportTXT(report));
    }
  }, [report]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  if (!report) return null;

  const handleFakeAction = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail('');
  };

  // Modal rendered via createPortal directly into document.body
  // This guarantees fixed positioning works regardless of parent transforms
  const modal = isModalOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-zinc-950 mb-2 tracking-tight">
              Získejte hotový podklad pro úřad
            </h3>

            {/* Cenová transparentnost */}
            <div className="inline-block mb-4 bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-semibold px-2.5 py-1 rounded-md">
              Předpokládaná cena: 199 Kč / měsíc
            </div>

            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              Zrovna implementujeme platební bránu pro prémiový přístup. Zanechte nám tu svůj e-mail a jakmile systém spustíme, pošleme vám odkaz s 1 měsícem zdarma jako poděkování za trpělivost.
            </p>

            <form action="https://formspree.io/f/xlgkbqvd" method="POST" className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="váš@email.cz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-md bg-zinc-50 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!email}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/70 text-white font-medium rounded-md transition-colors"
              >
                Chci přístup zdarma
              </button>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className="space-y-8">
        {/* Primary Action (Fake Door) */}
        <div className="flex justify-start">
          <button
            onClick={handleFakeAction}
            id="download-btn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            <Lock className="w-4 h-4" />
            Stáhnout podklad pro úřad
          </button>
        </div>

        {/* Fallback Preview (Obscured) */}
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
            <p className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-400" />
              Obsah souboru
            </p>
            <button
              onClick={handleFakeAction}
              id="copy-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
            >
              <Copy className="w-3.5 h-3.5" />
              Kopírovat
            </button>
          </div>

          <div className="p-4 bg-zinc-50/30 relative">
            <textarea
              ref={textareaRef}
              readOnly
              value={generatedText}
              id="export-textarea"
              rows={12}
              className="w-full text-xs font-mono text-zinc-800 bg-white p-4 rounded-md border border-zinc-200 resize-none blur-[4px] select-none pointer-events-none"
            />

            {/* Overlay to intercept clicks on textarea area */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
              onClick={handleFakeAction}
            >
              <span className="bg-white/90 backdrop-blur text-zinc-950 text-sm font-semibold px-4 py-2 rounded-full border border-zinc-200 shadow-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Odemknout plný přístup
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal portaled to document.body — immune to parent transforms */}
      {modal}
    </>
  );
}

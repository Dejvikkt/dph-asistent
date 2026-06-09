import { useState, useCallback } from 'react';
import {
  Shield,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  CloudOff,
  LogIn,
  Download,
  UploadCloud,
  ShieldAlert,
} from 'lucide-react';
import DropZone from './components/DropZone';
import Report from './components/Report';
import ExportButton from './components/ExportButton';
import { parseCSV, filterFees, calculateDPH } from './lib/calculator';

// ==================== STATUS MESSAGE ====================
function StatusMessage({ type, title, message }) {
  const config = {
    processing: {
      icon: Loader2,
      iconClass: 'text-zinc-900 animate-spin',
      containerClass: 'border-zinc-200 bg-white',
    },
    success: {
      icon: CheckCircle2,
      iconClass: 'text-emerald-600',
      containerClass: 'border-emerald-200 bg-emerald-50',
    },
    error: {
      icon: AlertTriangle,
      iconClass: 'text-zinc-900',
      containerClass: 'border-zinc-200 bg-white',
    },
    warning: {
      icon: AlertTriangle,
      iconClass: 'text-zinc-900',
      containerClass: 'border-zinc-200 bg-white',
    },
  };

  const { icon: Icon, iconClass, containerClass } = config[type];

  return (
    <div className={`flex items-start gap-4 p-4 rounded-md border animate-fade-in shadow-sm ${containerClass}`}>
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconClass}`} strokeWidth={2} />
      <div>
        <p className={`text-sm font-semibold ${type === 'success' ? 'text-emerald-800' : 'text-zinc-950'}`}>{title}</p>
        <p className={`text-sm mt-1 ${type === 'success' ? 'text-emerald-700' : 'text-zinc-500'}`}>{message}</p>
      </div>
    </div>
  );
}

// ==================== PLATFORM LOGOS (Social Proof) ====================
const PLATFORMS = ['Stripe', 'Patreon', 'OnlyFans', 'HeroHero', 'Gumroad'];

function PlatformLogos() {
  return (
    <div className="mt-16 text-center">
      <p className="text-sm text-zinc-400 font-medium tracking-wide uppercase mb-6">
        Podporujeme exporty z platforem
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {PLATFORMS.map((name) => (
          <span
            key={name}
            className="text-xl font-bold text-zinc-300 hover:text-zinc-600 transition-colors cursor-default select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ==================== CSV GUIDE ====================
function CsvGuide() {
  const steps = [
    {
      icon: LogIn,
      iconColor: 'text-zinc-500',
      title: 'Přihlaste se',
      text: 'Otevřete svůj účet na Patreonu nebo Stripe a jděte do sekce Výplaty / Analytics.',
    },
    {
      icon: Download,
      iconColor: 'text-zinc-500',
      title: 'Stáhněte export',
      text: 'Najděte tlačítko Export nebo Download a vyberte formát CSV pro vybraný měsíc.',
    },
    {
      icon: UploadCloud,
      iconColor: 'text-emerald-600',
      title: 'Nahrajte sem',
      text: 'Přetáhněte stažený soubor nahoru do našeho asistenta. Zbytek zařídíme my.',
    },
  ];

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">
        Nevíte, kde stáhnout svá data?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-zinc-50 rounded-xl p-6 border border-zinc-100"
          >
            <step.icon className={`w-6 h-6 ${step.iconColor} mb-4`} strokeWidth={2} />
            <h3 className="text-sm font-bold text-zinc-900 mb-2">{step.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== FAQ ====================
const FAQ_ITEMS = [
  {
    question: 'Co je to "Identifikovaná osoba k DPH"?',
    answer:
      'Jakmile přijmete službu ze zahraničí (např. vám Stripe nebo Patreon strhne poplatek z výdělku), stáváte se ze zákona Identifikovanou osobou. Od toho měsíce musíte podávat přiznání k DPH, i když jinak nejste plátci.',
  },
  {
    question: 'Co se stane, když to budu ignorovat?',
    answer:
      'Finanční úřad vám může daň doměřit zpětně i s penále. Platformy navíc podle nové směrnice (DAC7) automaticky reportují vaše příjmy státním úřadům. Dnes už se to neschová.',
  },
  {
    question: 'Musím si kvůli tomu platit drahou účetní?',
    answer:
      'Ne. Většina tvůrců zvládne podat tzv. nulové přiznání s naším nástrojem sama. Aplikace za vás z exportu vytáhne přesně ty řádky, které úřad zajímají.',
  },
];

function FaqSection() {
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12 text-zinc-950">
        Proč to vlastně musíte řešit?
      </h2>
      <div className="max-w-2xl mx-auto">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`pb-6 mb-6 ${i < FAQ_ITEMS.length - 1 ? 'border-b border-zinc-100' : ''}`}
          >
            <h3 className="font-semibold text-zinc-900 text-lg">
              {item.question}
            </h3>
            <p className="text-zinc-500 mt-2 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== APP ====================
export default function App() {
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rates, setRates] = useState({ USD: 23.50, EUR: 25.30 });
  const [legalConsent, setLegalConsent] = useState(false);

  const processFile = useCallback((csvText, fileName) => {
    if (!legalConsent) {
      setStatus({
        type: 'error',
        title: 'Chybějící souhlas',
        message: 'Prosím, potvrďte právní doložku pro pokračování.',
      });
      return;
    }

    setIsProcessing(true);
    setReport(null);
    setStatus({ type: 'processing', title: 'Zpracovávám data', message: `Analyzuji soubor: ${fileName}` });

    setTimeout(() => {
      try {
        const rows = parseCSV(csvText);
        const fees = filterFees(rows);

        if (fees.length === 0) {
          setStatus({
            type: 'warning',
            title: 'Žádné poplatky nenalezeny',
            message: `Načteno ${rows.length} řádků, ale žádný neobsahuje klíčové slovo poplatku. Zkontrolujte formát CSV.`,
          });
          setIsProcessing(false);
          return;
        }

        const result = calculateDPH(fees, { ...rates, CZK: 1.00 });
        setReport(result);
        setStatus({
          type: 'success',
          title: 'Zpracování dokončeno',
          message: `Nalezeno ${fees.length} poplatků. Základ daně vypočten.`,
        });
      } catch (err) {
        setStatus({
          type: 'error',
          title: 'Chyba analýzy',
          message: err.message,
        });
      } finally {
        setIsProcessing(false);
      }
    }, 400); // Rychlejší odezva
  }, [rates, legalConsent]);

  const handleReset = () => {
    setReport(null);
    setStatus(null);
  };

  return (
    <div className="min-h-screen text-zinc-950 selection:bg-zinc-200 selection:text-zinc-900 font-sans">
      <main className="max-w-4xl mx-auto px-6 py-20 md:py-32">
        
        {/* Header */}
        <header className="mb-16 md:mb-24 animate-fade-in text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center justify-center mb-8">
            <span className="border border-zinc-200 rounded-full px-4 py-1.5 text-sm text-zinc-500 font-medium bg-white/50 backdrop-blur-sm shadow-sm">
              Nástroj pro nezávislé tvůrce
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-950 mb-6">
            DPH <span className="text-emerald-600">Asistent</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            Vypočítejte DPH z poplatků na Patreonu, Stripe nebo OnlyFans. Rychle, lokálně a bez posílání citlivých dat na servery.
          </p>

          {/* Human badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
              <Shield className="w-4 h-4 text-emerald-600" /> 100% Soukromí
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
              <HardDrive className="w-4 h-4 text-zinc-400" /> Data neopustí váš počítač
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
              <CloudOff className="w-4 h-4 text-zinc-400" /> Nikam nic neposíláme
            </span>
          </div>
        </header>

        {/* Core Workspace */}
        <div className="space-y-8 animate-fade-in">
          
          {/* Krok 1: Kurzy */}
          <div className="border border-zinc-200 rounded-xl p-4 mb-2 bg-white">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">
              Krok 1: Zadejte platný kurz ČNB pro daný měsíc
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-2">
                <label htmlFor="rate-usd" className="text-sm text-zinc-600 font-medium whitespace-nowrap">
                  1 USD =
                </label>
                <input
                  id="rate-usd"
                  type="number"
                  step="0.01"
                  value={rates.USD}
                  onChange={(e) => setRates({ ...rates, USD: parseFloat(e.target.value) || 0 })}
                  className="w-24 px-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
                <span className="text-sm text-zinc-500">CZK</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="rate-eur" className="text-sm text-zinc-600 font-medium whitespace-nowrap">
                  1 EUR =
                </label>
                <input
                  id="rate-eur"
                  type="number"
                  step="0.01"
                  value={rates.EUR}
                  onChange={(e) => setRates({ ...rates, EUR: parseFloat(e.target.value) || 0 })}
                  className="w-24 px-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
                <span className="text-sm text-zinc-500">CZK</span>
              </div>
            </div>
          </div>

          <DropZone onFileLoaded={processFile} isProcessing={isProcessing} />

          {/* Legal Consent Checkbox */}
          <label className="flex items-start gap-3 mt-4 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                className="peer appearance-none w-5 h-5 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20 checked:bg-emerald-600 checked:border-emerald-600 transition-colors"
                checked={legalConsent}
                onChange={(e) => setLegalConsent(e.target.checked)}
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm text-zinc-600 leading-relaxed select-none group-hover:text-zinc-900 transition-colors">
              Rozumím, že tento nástroj slouží pouze pro orientační výpočet. Zodpovědnost za správnost údajů a použitý kurz ČNB pro Finanční správu nesu já.
            </span>
          </label>

          {status && <StatusMessage {...status} />}

          {report && (
            <div className="space-y-12">
              <Report report={report} />

              <div className="pt-8 border-t border-zinc-200">
                <ExportButton report={report} />
                
                <div className="mt-8">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resetovat a nahrát nový soubor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Proof, Guide & FAQ — visible only before report */}
        {!report && (
          <>
            <PlatformLogos />
            <CsvGuide />
            <FaqSection />
          </>
        )}

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-zinc-200 text-xs text-zinc-400 text-center flex flex-col gap-2">
          <p>Verze aplikace 1.0 (Beta) | Kurzy měn jsou aktuálně nastaveny napevno pro testovací účely. Před podáním přiznání si kurz zkontrolujte.</p>
          <p>© {new Date().getFullYear()} DPH Asistent</p>
        </footer>
      </main>
    </div>
  );
}

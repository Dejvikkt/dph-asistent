import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen text-zinc-950 selection:bg-zinc-200 selection:text-zinc-900 font-sans">
      <main className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Zpět na hlavní stránku
        </Link>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 mb-8">
          Podmínky užití
        </h1>
        
        <div className="space-y-6 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Úvodní ustanovení</h2>
            <p>
              Nástroj DPH Asistent (dále jen "Aplikace") poskytuje orientační výpočty základu daně z přidané hodnoty (DPH) na základě dat zprostředkovaných uživatelem (zpravidla prostřednictvím souborů formátu CSV). Aplikace je poskytována jako osobní projekt "tak jak je" (as is), bez jakýchkoli výslovných nebo předpokládaných záruk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Odpovědnost uživatele</h2>
            <p>
              Výpočty poskytované Aplikací jsou <strong>pouze orientační a nemají povahu daňového, účetního či právního poradenství</strong>. Konečnou odpovědnost za správnost daňového přiznání a plnění daňových povinností podle platných právních předpisů (včetně volby a použití správného kurzu ČNB) nese výlučně uživatel. Důrazně doporučujeme konzultovat výsledky s kvalifikovaným daňovým poradcem nebo účetním.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Zpracování dat a soukromí</h2>
            <p>
              Zpracování nahraných souborů probíhá <strong>výhradně lokálně ve vašem prohlížeči</strong> (tzv. client-side). Obsah nahraných souborů se neukládá na naše servery, nepřenáší se po síti a nemáme k němu přístup. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Vyloučení odpovědnosti</h2>
            <p>
              Provozovatel této Aplikace nenese žádnou odpovědnost za přímé, nepřímé, náhodné, zvláštní nebo následné škody (včetně škod způsobených doměřením daně nebo penalizací ze strany orgánů Finanční správy) vyplývající z použití, nebo neschopnosti použít, tuto Aplikaci.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Kontakt</h2>
            <p>
              Aplikace je provozována jako nekomerční osobní projekt. V případě jakýchkoliv dotazů ohledně funkčnosti můžete zanechat zpětnou vazbu prostřednictvím formuláře pro předběžný zájem v Aplikaci.
            </p>
          </section>
        </div>
        
        <p className="mt-12 text-sm text-zinc-400">
          Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
        </p>
      </main>
    </div>
  );
}
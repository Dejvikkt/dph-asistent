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
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Žádné daňové poradenství</h2>
            <p>
              Výpočty poskytované Aplikací jsou <strong>čistě orientační a nenahrazují kvalifikované daňové, účetní či právní poradenství</strong>. Aplikace představuje pouze technický nástroj pro usnadnění extrakce a součtu dat z vámi dodaných souborů. Výhradní a plnou odpovědnost za správnost daňového přiznání, výpočet daně, plnění daňových povinností a správnost použitých měnových kurzů nese vždy a pouze uživatel. Důrazně doporučujeme veškeré výstupy z Aplikace zkontrolovat a konzultovat s certifikovaným daňovým poradcem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Zpracování dat a soukromí</h2>
            <p>
              Zpracování nahraných souborů probíhá <strong>výhradně lokálně ve vašem prohlížeči</strong> (tzv. client-side). Obsah nahraných souborů se neukládá na naše servery, nepřenáší se po síti a my k nim nemáme v žádném okamžiku přístup.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Vyloučení odpovědnosti (Pravidlo "Jak stojí a leží")</h2>
            <p>
              Aplikace je uživateli poskytována ve stavu "jak stojí a leží" (as-is). Provozovatel se tímto v maximálním rozsahu povoleném platnými právními předpisy (ust. § 2898 občanského zákoníku) výslovně zříká jakékoliv odpovědnosti za škody. Provozovatel <strong>neodpovídá za případné softwarové chyby v Aplikaci (tzv. bugy), chyby ve výpočtu, nesprávnou extrakci dat ani za jakékoliv přímé či nepřímé škody</strong>, majetkové sankce, penále nebo doměření daně ze strany orgánů Finanční správy či jiných úřadů, které by uživateli mohly vzniknout v souvislosti s použitím výstupů z této Aplikace.
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
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen text-zinc-950 selection:bg-zinc-200 selection:text-zinc-900 font-sans">
      <main className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Zpět na hlavní stránku
        </Link>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 mb-8">
          Zásady ochrany osobních údajů
        </h1>
        
        <div className="space-y-6 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Zpracování dat z CSV</h2>
            <p>
              Základním principem Aplikace je maximální ochrana vašeho soukromí. <strong>Veškeré výpočty a analýzy nahraných souborů (CSV exporty z platforem jako Stripe, Patreon apod.) probíhají výhradně na vašem zařízení (lokálně ve webovém prohlížeči)</strong>. Žádná data z těchto souborů se neodesílají na žádný server, neukládají se do databáze a po zavření záložky v prohlížeči jsou trvale odstraněna z operační paměti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Formulář pro zájemce (čekací listina)</h2>
            <p>
              Pokud se rozhodnete projevit zájem o budoucí plnou verzi Aplikace, můžete nám poskytnout svou e-mailovou adresu. Tato e-mailová adresa je zpracována prostřednictvím služby třetí strany (Formspree) a je použita výhradně k tomu, abychom vás mohli informovat o spuštění plné verze nebo zaslat nabídku předběžného přístupu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Služby třetích stran</h2>
            <p>
              Aplikace je hostována na platformě Vercel, která může v nezbytném rozsahu sbírat standardní technická data (např. IP adresy) za účelem zajištění bezpečnosti a spolehlivosti doručování obsahu, jak je běžné u webového hostingu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Vaše práva</h2>
            <p>
              Vzhledem k tomu, že kromě dobrovolně zadaného e-mailu (pokud jej zadáte) neshromažďujeme žádné osobní údaje, nevyplývají pro nás žádné další povinnosti ohledně jejich zpracování. Máte právo kdykoliv požádat o smazání vaší e-mailové adresy z naší databáze (z formuláře zájemců).
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
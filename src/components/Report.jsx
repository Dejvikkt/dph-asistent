import { Receipt, Coins, Landmark, ArrowRightLeft, AlertTriangle } from 'lucide-react';

function StatCard({ label, value, sublabel, accent = false }) {
  return (
    <div className={`p-6 rounded-lg border bg-white shadow-sm ${
      accent ? 'border-zinc-900 ring-1 ring-zinc-900/5' : 'border-zinc-200'
    }`}>
      <p className="text-sm font-medium text-zinc-500 mb-2">{label}</p>
      <p className={`text-3xl font-extrabold tracking-tight ${
        accent ? 'text-zinc-950' : 'text-zinc-900'
      }`}>
        {value}
      </p>
      {sublabel && (
        <p className="text-sm text-zinc-500 mt-2">{sublabel}</p>
      )}
    </div>
  );
}

function DetailTable({ detaily }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-200 bg-zinc-50/50">
        <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-zinc-500" />
          Detail zpracovaných poplatků
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 font-medium text-zinc-500">Datum</th>
              <th className="px-6 py-4 font-medium text-zinc-500">Popis transakce</th>
              <th className="px-6 py-4 font-medium text-zinc-500 text-right">Částka (Původní)</th>
              <th className="px-6 py-4 font-medium text-zinc-500 text-right">Kurz</th>
              <th className="px-6 py-4 font-semibold text-zinc-950 text-right">Základ (CZK)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {detaily.map((d, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-3 text-zinc-500 font-mono text-xs">{d.datum}</td>
                <td className="px-6 py-3 font-medium text-zinc-900">{d.popis}</td>
                <td className="px-6 py-3 text-right text-zinc-600 font-mono text-xs">
                  {Math.abs(d.castka).toFixed(2)} {d.mena}
                </td>
                <td className="px-6 py-3 text-right text-zinc-400 font-mono text-xs">
                  {d.kurz ? d.kurz.toFixed(2) : '—'}
                </td>
                <td className="px-6 py-3 text-right font-mono text-sm font-semibold text-zinc-950">
                  {d.castkaCZK != null ? `${d.castkaCZK.toFixed(2)} Kč` : (
                    <span className="text-red-600 flex items-center justify-end gap-1 font-sans text-xs font-normal">
                      <AlertTriangle className="w-3 h-3" />
                      {d.chyba}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExchangeRates({ poMenach }) {
  return (
    <div className="p-6 rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-4 h-4 text-zinc-500" />
        Použité kurzy
      </h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(poMenach).map(([mena, data]) => (
          <div key={mena} className="flex items-center gap-3 text-sm">
            <span className="font-medium text-zinc-600">1 {mena}</span>
            <span className="text-zinc-300">=</span>
            <span className="font-semibold text-zinc-950">{data.kurz.toFixed(2)} CZK</span>
            <span className="text-xs text-zinc-500 bg-zinc-200/50 px-2 py-0.5 rounded-md">{data.pocet} transakcí</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Report({ report }) {
  if (!report) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Zpracováno poplatků"
          value={report.pocetPoplatku}
          sublabel="Nalezeno v exportu"
        />
        <StatCard
          label="Základ daně (CZK)"
          value={`${report.zakladDaneCZK.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })}`}
          sublabel="Součet po konverzi"
        />
        <StatCard
          label="Daň k odvodu"
          value={`${report.dphKOdvodu.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč`}
          sublabel={`Sazba DPH ${report.sazbaDPH * 100} %`}
          accent={true}
        />
      </div>

      {/* Exchange Rates */}
      {Object.keys(report.poMenach).length > 0 && (
        <ExchangeRates poMenach={report.poMenach} />
      )}

      {/* Detail Table */}
      {report.detaily.length > 0 && (
        <DetailTable detaily={report.detaily} />
      )}
    </div>
  );
}

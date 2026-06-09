/**
 * Daňový asistent – konstanty a výpočetní logika
 * Veškeré výpočty probíhají striktně na straně klienta.
 */

// ==================== KONSTANTY ====================

/** Sazba české DPH (21 %) */
export const SAZBA_DPH = 0.21;

/** Klíčová slova identifikující poplatky (fees) v popisu transakce */
const FEE_KEYWORDS = [
  'fee',
  'fees',
  'poplatek',
  'poplatky',
  'platform fee',
  'processing fee',
  'service fee',
  'payment processing',
  'transaction fee',
  'commission',
  'provize',
  'stripe fee',
  'patreon fee',
  'payout fee',
];

// ==================== PARSER ====================

/**
 * Parsuje CSV řetězec na pole objektů.
 * Očekává sloupce: Datum, Popis transakce, Částka, Měna
 * Podporuje různé oddělovače (čárka, středník, tabulátor).
 */
export function parseCSV(csvText) {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV soubor musí obsahovat hlavičku a alespoň jeden řádek dat.');
  }

  // Detect delimiter
  const header = lines[0];
  let delimiter = ',';
  if (header.includes(';')) delimiter = ';';
  else if (header.includes('\t')) delimiter = '\t';

  const parseRow = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());

  // Map known column names (Czech and English)
  const colMap = {};
  const datumAliases = ['datum', 'date', 'transaction date', 'datum transakce'];
  const popisAliases = ['popis transakce', 'popis', 'description', 'type', 'transaction type', 'název'];
  const castkaAliases = ['částka', 'castka', 'amount', 'value', 'suma'];
  const menaAliases = ['měna', 'mena', 'currency', 'curr'];

  headers.forEach((h, i) => {
    const lower = h.toLowerCase();
    if (datumAliases.includes(lower)) colMap.datum = i;
    else if (popisAliases.includes(lower)) colMap.popis = i;
    else if (castkaAliases.includes(lower)) colMap.castka = i;
    else if (menaAliases.includes(lower)) colMap.mena = i;
  });

  // Fallback: if we have exactly 4 columns and nothing matched, use positional
  if (Object.keys(colMap).length < 4 && headers.length >= 4) {
    if (colMap.datum === undefined) colMap.datum = 0;
    if (colMap.popis === undefined) colMap.popis = 1;
    if (colMap.castka === undefined) colMap.castka = 2;
    if (colMap.mena === undefined) colMap.mena = 3;
  }

  if (colMap.castka === undefined) {
    throw new Error('Nepodařilo se najít sloupec s částkou. Zkontrolujte, že CSV obsahuje sloupce: Datum, Popis transakce, Částka, Měna.');
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length < 2) continue;

    const rawCastka = values[colMap.castka] || '0';
    // Handle Czech number format: replace comma with dot
    const castka = parseFloat(rawCastka.replace(/[^\d.\-,]/g, '').replace(',', '.'));

    if (isNaN(castka)) continue;

    rows.push({
      datum: values[colMap.datum] || '',
      popis: values[colMap.popis] || '',
      castka: castka,
      mena: (values[colMap.mena] || 'USD').toUpperCase().trim(),
      original: lines[i],
    });
  }

  return rows;
}


// ==================== FILTR POPLATKŮ ====================

/**
 * Filtruje pouze řádky představující poplatky (fees).
 */
export function filterFees(rows) {
  return rows.filter(row => {
    const popis = row.popis.toLowerCase();
    return FEE_KEYWORDS.some(keyword => popis.includes(keyword));
  });
}


// ==================== KALKULAČKA ====================

/**
 * Vypočítá DPH report z pole poplatků.
 * Vrací objekt s detailním přehledem.
 */
export function calculateDPH(fees, rates) {
  let celkovyZakladCZK = 0;
  const detaily = [];
  const poMenach = {};

  for (const fee of fees) {
    const kurz = rates[fee.mena] || null;
    const absolutniCastka = Math.abs(fee.castka);

    if (!kurz) {
      detaily.push({
        ...fee,
        castkaCZK: null,
        kurz: null,
        chyba: `Neznámá měna: ${fee.mena}`,
      });
      continue;
    }

    const castkaCZK = absolutniCastka * kurz;
    celkovyZakladCZK += castkaCZK;

    // Agregace podle měn
    if (!poMenach[fee.mena]) {
      poMenach[fee.mena] = { celkem: 0, pocet: 0, kurz };
    }
    poMenach[fee.mena].celkem += absolutniCastka;
    poMenach[fee.mena].pocet += 1;

    detaily.push({
      ...fee,
      castkaCZK: Math.round(castkaCZK * 100) / 100,
      kurz,
      chyba: null,
    });
  }

  const dph = Math.round(celkovyZakladCZK * SAZBA_DPH * 100) / 100;
  const zakladZaokrouhleny = Math.round(celkovyZakladCZK * 100) / 100;

  return {
    pocetPoplatku: fees.length,
    zakladDaneCZK: zakladZaokrouhleny,
    dphKOdvodu: dph,
    sazbaDPH: SAZBA_DPH,
    poMenach,
    detaily,
  };
}


// ==================== EXPORT ====================

/**
 * Generuje podklad pro finanční úřad ve formátu JSON.
 */
export function generateExportJSON(report) {
  const now = new Date();
  const exportData = {
    hlavicka: {
      nazev: 'Podklad pro přiznání DPH — identifikovaná osoba',
      vygenerovano: now.toISOString(),
      obdobi: `${now.getMonth()}/${now.getFullYear()}`,
      aplikace: 'DPH Asistent pro tvůrce v1.0',
      upozorneni: 'Tento dokument je orientační podklad. Vždy konzultujte s daňovým poradcem.',
    },
    souhrn: {
      pocet_zpracovanych_poplatku: report.pocetPoplatku,
      zaklad_dane_czk: report.zakladDaneCZK,
      sazba_dph: `${report.sazbaDPH * 100} %`,
      dph_k_odvodu_czk: report.dphKOdvodu,
    },
    pouzite_kurzy: Object.entries(report.poMenach).map(([mena, data]) => ({
      mena,
      kurz_czk: data.kurz,
      poznamka: 'Simulovaný kurz pro MVP – v produkci použijte kurz ČNB.',
    })),
    detailni_polozky: report.detaily.map((d, i) => ({
      poradi: i + 1,
      datum: d.datum,
      popis: d.popis,
      castka_original: `${Math.abs(d.castka)} ${d.mena}`,
      castka_czk: d.castkaCZK,
      kurz: d.kurz,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Generuje podklad v textovém formátu.
 */
export function generateExportTXT(report) {
  const now = new Date();
  const divider = '═'.repeat(52);
  const thinDivider = '─'.repeat(52);

  let txt = '';
  txt += `${divider}\n`;
  txt += `  PODKLAD PRO PŘIZNÁNÍ DPH\n`;
  txt += `  Identifikovaná osoba k DPH\n`;
  txt += `${divider}\n\n`;
  txt += `  Vygenerováno: ${now.toLocaleDateString('cs-CZ')} ${now.toLocaleTimeString('cs-CZ')}\n`;
  txt += `  Aplikace:     DPH Asistent pro tvůrce v1.0\n\n`;
  txt += `${thinDivider}\n`;
  txt += `  SOUHRN\n`;
  txt += `${thinDivider}\n\n`;
  txt += `  Zpracováno poplatků:     ${report.pocetPoplatku}\n`;
  txt += `  Základ daně (CZK):       ${report.zakladDaneCZK.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč\n`;
  txt += `  Sazba DPH:               ${report.sazbaDPH * 100} %\n`;
  txt += `  DPH k odvodu:            ${report.dphKOdvodu.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč\n\n`;

  txt += `${thinDivider}\n`;
  txt += `  POUŽITÉ KURZY\n`;
  txt += `${thinDivider}\n\n`;

  for (const [mena, data] of Object.entries(report.poMenach)) {
    txt += `  1 ${mena} = ${data.kurz.toFixed(2)} CZK (simulovaný kurz)\n`;
  }

  txt += `\n${thinDivider}\n`;
  txt += `  DETAILNÍ POLOŽKY\n`;
  txt += `${thinDivider}\n\n`;

  report.detaily.forEach((d, i) => {
    txt += `  ${(i + 1).toString().padStart(3, ' ')}. ${d.datum.padEnd(12)} | ${d.popis.substring(0, 30).padEnd(30)} | ${Math.abs(d.castka).toFixed(2)} ${d.mena} → ${d.castkaCZK?.toFixed(2) || '?'} CZK\n`;
  });

  txt += `\n${divider}\n`;
  txt += `  ⚠ Tento dokument je orientační podklad.\n`;
  txt += `  Vždy konzultujte s daňovým poradcem.\n`;
  txt += `${divider}\n`;

  return txt;
}

/**
 * Stáhne soubor do prohlížeče.
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

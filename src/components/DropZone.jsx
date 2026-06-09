import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, Sparkles } from 'lucide-react';

export default function DropZone({ onFileLoaded, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Prosím nahrajte soubor ve formátu CSV.');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileLoaded(e.target.result, file.name);
    };
    reader.readAsText(file, 'UTF-8');
  }, [onFileLoaded]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div
        id="drop-zone"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone relative cursor-pointer rounded-lg py-16 md:py-24 px-6 text-center bg-white shadow-sm transition-colors hover:bg-zinc-50/50 ${
          isDragging ? 'drag-over' : ''
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleInputChange}
          id="csv-file-input"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-3 bg-zinc-100 rounded-md border border-zinc-200">
            {fileName ? (
              <FileSpreadsheet className="w-6 h-6 text-zinc-950" strokeWidth={2} />
            ) : (
              <Upload className={`w-6 h-6 ${isDragging ? 'text-zinc-950' : 'text-zinc-500'}`} strokeWidth={2} />
            )}
          </div>

          {fileName ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-md border border-zinc-200">
                <span className="text-sm font-medium text-zinc-900">{fileName}</span>
                <button
                  onClick={clearFile}
                  className="p-1 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200 rounded transition-colors"
                  title="Odstranit soubor"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-950">
                {isDragging ? 'Pusťte soubor...' : 'Přetáhněte soubor sem nebo klikněte k výběru'}
              </p>
              <p className="text-xs text-zinc-500">
                Podporuje CSV exporty (Stripe, Patreon, atd.)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <a
          href="/ukazkova-data.csv"
          download
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Vyzkoušet s ukázkovými daty
        </a>
      </div>
    </div>
  );
}

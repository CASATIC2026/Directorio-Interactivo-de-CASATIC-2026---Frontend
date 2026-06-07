import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Search, X } from 'lucide-react';

export const LETTER_OPTIONS = ['Todos', '0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export function normalizeText(value = '') {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
}

export function matchesInitial(name, letter) {
  if (!letter || letter === 'Todos') return true;
  const first = normalizeText(name).trim().charAt(0);
  if (letter === '0-9') return /^[0-9]$/.test(first);
  return first === letter;
}

function EspecialidadesDropdown({ especialidades, selectedEspecialidades, onToggleEspecialidad, onClearEspecialidades }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current || !panelRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const panelWidth = Math.max(r.width, 280);
    const left = Math.min(r.left, window.innerWidth - panelWidth - 8);
    panelRef.current.style.top = `${r.bottom + 6}px`;
    panelRef.current.style.left = `${Math.max(8, left)}px`;
    panelRef.current.style.width = `${panelWidth}px`;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target) &&
          panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const label = selectedEspecialidades.length === 0
    ? 'Especialidades'
    : `${selectedEspecialidades.length} seleccionada${selectedEspecialidades.length > 1 ? 's' : ''}`;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`input-field h-11 flex items-center justify-between gap-2 text-sm w-full ${selectedEspecialidades.length > 0 ? 'border-casatic-400 text-casatic-700' : ''}`}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <Filter size={15} className="text-surface-400 flex-shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        <svg className={`w-4 h-4 text-surface-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: -9999, left: -9999, zIndex: 99999 }}
          className="rounded-xl border border-surface-200 bg-white shadow-xl p-3"
        >
          <div className="flex items-center justify-between gap-3 border-b border-surface-100 pb-2 mb-2">
            <p className="text-xs font-bold uppercase tracking-wide text-surface-500">Especialidades</p>
            {selectedEspecialidades.length > 0 && (
              <button type="button" onClick={onClearEspecialidades} className="text-xs font-semibold text-casatic-600 hover:text-casatic-700">
                Limpiar
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
            {especialidades.map((esp) => {
              const checked = selectedEspecialidades.includes(esp);
              return (
                <label
                  key={esp}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm cursor-pointer transition-colors ${checked ? 'bg-casatic-50 text-casatic-800' : 'hover:bg-surface-50 text-surface-700'}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleEspecialidad(esp)}
                    className="h-4 w-4 rounded border-surface-300 text-casatic-600 focus:ring-casatic-500"
                  />
                  <span className="leading-snug">{esp}</span>
                </label>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default function CompanyFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar empresa...',
  letter,
  onLetterChange,
  especialidades,
  selectedEspecialidades,
  onToggleEspecialidad,
  onClearEspecialidades,
  onClearAll,
  resultCount,
  className = '',
}) {
  const hasFilters =
    Boolean(search) ||
    letter !== 'Todos' ||
    selectedEspecialidades.length > 0;

  return (
    <div className={`rounded-xl border border-surface-200 bg-white shadow-sm ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_220px_auto] gap-2 p-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-9 text-sm h-11"
          />
        </div>

        <select
          value={letter}
          onChange={(e) => onLetterChange(e.target.value)}
          className="input-field text-sm h-11"
          aria-label="Filtrar por inicial"
        >
          {LETTER_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item === 'Todos' ? 'Todas las letras' : item}
            </option>
          ))}
        </select>

        <EspecialidadesDropdown
          especialidades={especialidades}
          selectedEspecialidades={selectedEspecialidades}
          onToggleEspecialidad={onToggleEspecialidad}
          onClearEspecialidades={onClearEspecialidades}
        />

        <div className="flex items-center justify-end gap-2">
          {resultCount !== undefined && (
            <span className="text-xs font-semibold text-surface-400 whitespace-nowrap px-1">
              {resultCount} resultados
            </span>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="h-11 px-3 rounded-lg border border-surface-200 text-surface-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              title="Limpiar filtros"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {(selectedEspecialidades.length > 0 || letter !== 'Todos') && (
        <div className="flex flex-wrap items-center gap-2 border-t border-surface-100 px-3 py-2">
          {resultCount !== undefined && (
            <span className="text-xs font-semibold text-surface-400 mr-1">{resultCount} resultados</span>
          )}
          {letter !== 'Todos' && (
            <button
              type="button"
              onClick={() => onLetterChange('Todos')}
              className="badge-primary text-[11px] inline-flex items-center gap-1"
            >
              {letter} <X size={12} />
            </button>
          )}
          {selectedEspecialidades.slice(0, 4).map((esp) => (
            <button
              key={esp}
              type="button"
              onClick={() => onToggleEspecialidad(esp)}
              className="badge-primary text-[11px] inline-flex items-center gap-1 max-w-[220px]"
            >
              <span className="truncate">{esp}</span> <X size={12} />
            </button>
          ))}
          {selectedEspecialidades.length > 4 && (
            <span className="badge-neutral text-[11px]">+{selectedEspecialidades.length - 4} mas</span>
          )}
        </div>
      )}
    </div>
  );
}

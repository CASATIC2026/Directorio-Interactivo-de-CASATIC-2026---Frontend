import { ChevronDown, Filter, Search, X } from 'lucide-react';

export const LETTER_OPTIONS = ['Todos', '0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export function normalizeText(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

export function matchesInitial(name, letter) {
  if (!letter || letter === 'Todos') return true;
  const first = normalizeText(name).trim().charAt(0);
  if (letter === '0-9') return /^[0-9]$/.test(first);
  return first === letter;
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
  service,
  onServiceChange,
  showService = false,
  onClearAll,
  resultCount,
  className = '',
}) {
  const hasFilters =
    Boolean(search) ||
    letter !== 'Todos' ||
    selectedEspecialidades.length > 0 ||
    Boolean(service);

  return (
    <div className={`rounded-xl border border-surface-200 bg-white shadow-sm ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,1fr)_160px_220px_auto] gap-2 p-3">
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

        <details className="relative group">
          <summary className="input-field h-11 list-none cursor-pointer flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-2 min-w-0">
              <Filter size={15} className="text-surface-400" />
              <span className="truncate">
                {selectedEspecialidades.length === 0
                  ? 'Especialidades'
                  : `${selectedEspecialidades.length} seleccionada${selectedEspecialidades.length > 1 ? 's' : ''}`}
              </span>
            </span>
            <ChevronDown size={15} className="text-surface-400 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-surface-200 bg-white shadow-elevated p-3">
            <div className="flex items-center justify-between gap-3 border-b border-surface-100 pb-2 mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-surface-500">Especialidades</p>
              {selectedEspecialidades.length > 0 && (
                <button
                  type="button"
                  onClick={onClearEspecialidades}
                  className="text-xs font-semibold text-casatic-600 hover:text-casatic-700"
                >
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
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm cursor-pointer transition-colors ${
                      checked ? 'bg-casatic-50 text-casatic-800' : 'hover:bg-surface-50 text-surface-700'
                    }`}
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
          </div>
        </details>

        <div className="flex items-center justify-between gap-2">
          {showService ? (
            <input
              type="text"
              placeholder="Servicio"
              value={service}
              onChange={(e) => onServiceChange(e.target.value)}
              className="input-field text-sm h-11 min-w-0"
            />
          ) : (
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

      {(selectedEspecialidades.length > 0 || letter !== 'Todos' || (showService && resultCount !== undefined)) && (
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

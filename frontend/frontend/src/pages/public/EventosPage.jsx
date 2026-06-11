import { useState, useEffect, useMemo } from 'react';
import api from '../../api/client';
import { resolveAssetUrl } from '../../utils/assetUrl';
import {
  Calendar, MapPin, Clock, Zap, Search,
  Users, Video, Globe, ChevronRight, Image as ImageIcon, X
} from 'lucide-react';
import casaticLogo from '../../img/Reverse - v2@4x.png';

/* ── Label maps (enum string → display) ────────────── */
const TIPO_LABELS = {
  Conferencia:  'Conferencia',
  Capacitacion: 'Capacitación',
  Webinar:      'Webinar',
  Networking:   'Networking',
  Feria:        'Feria',
  Taller:       'Taller',
  Seminario:    'Seminario',
  Expo:         'Expo',
  Lanzamiento:  'Lanzamiento',
  Reunion:      'Reunión',
};

const MODALIDAD_LABELS = {
  Presencial: 'Presencial',
  Virtual:    'Virtual',
  Hibrido:    'Híbrida',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-SV', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getModalidadIcon(modalidad) {
  if (modalidad === 'Virtual')    return <Video size={16} />;
  if (modalidad === 'Hibrido')    return <Globe size={16} />;
  if (modalidad === 'Presencial') return <Users size={16} />;
  return <Zap size={16} />;
}

function EventoCard({ evento }) {
  const fechaInicio = new Date(evento.fechaInicio);
  const proximo     = fechaInicio > new Date();
  const imagenUrl   = resolveAssetUrl(evento.imagenUrl);

  return (
    <div className="group h-full bg-white rounded-xl shadow-card border border-surface-100 overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Imagen */}
      <div className="aspect-[16/9] bg-gradient-to-br from-casatic-100 to-casatic-50 overflow-hidden">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={evento.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-casatic-300">
            <ImageIcon size={44} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-1 flex-col">
        {/* Estado + Tipo */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            proximo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            <Zap size={12} />
            {proximo ? 'Próximo' : 'Finalizado'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-casatic-100 text-casatic-700">
            {TIPO_LABELS[evento.tipo] || evento.tipo}
          </span>
        </div>

        <h3 className="text-lg font-bold text-surface-900 mb-2 line-clamp-2">{evento.titulo}</h3>
        <p  className="text-sm text-surface-600 mb-4 line-clamp-2">{evento.descripcion}</p>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-surface-600">
            <Calendar size={14} className="text-casatic-600 flex-shrink-0" />
            <span>{formatDate(evento.fechaInicio)}</span>
          </div>
          <div className="flex items-center gap-2 text-surface-600">
            <span className="text-casatic-600">{getModalidadIcon(evento.modalidad)}</span>
            <span>{MODALIDAD_LABELS[evento.modalidad] || evento.modalidad}</span>
          </div>
          {evento.lugar && (
            <div className="flex items-center gap-2 text-surface-600">
              <MapPin size={14} className="text-casatic-600 flex-shrink-0" />
              <span className="truncate">{evento.lugar}</span>
            </div>
          )}
        </div>

        {evento.socioNombre && (
          <div className="pt-3 border-t border-surface-100">
            <p className="text-xs text-surface-500 mb-1">Organizado por:</p>
            <p className="font-semibold text-surface-900">{evento.socioNombre}</p>
          </div>
        )}

        <button className="btn-secondary w-full mt-auto justify-center">
          Ver detalles <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function EventoDetailModal({ evento, onClose }) {
  if (!evento) return null;
  const imagenUrl = resolveAssetUrl(evento.imagenUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-[16/9] bg-gradient-to-br from-casatic-100 to-casatic-50 overflow-hidden">
          {imagenUrl ? (
            <img src={imagenUrl} alt={evento.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-casatic-300">
              <ImageIcon size={56} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-casatic-100 text-casatic-700">
              {TIPO_LABELS[evento.tipo] || evento.tipo}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {getModalidadIcon(evento.modalidad)}
              {MODALIDAD_LABELS[evento.modalidad] || evento.modalidad}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-surface-900 mb-2">{evento.titulo}</h2>

          {evento.socioNombre && (
            <p className="text-sm text-surface-600 mb-6">
              Organizado por <span className="font-semibold text-casatic-600">{evento.socioNombre}</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-surface-100">
            <div>
              <p className="text-sm font-semibold text-surface-500 mb-2">
                <Calendar className="inline mr-1" size={14} /> Fecha de Inicio
              </p>
              <p className="text-lg font-semibold text-surface-900">{formatDate(evento.fechaInicio)}</p>
            </div>
            {evento.fechaFin && (
              <div>
                <p className="text-sm font-semibold text-surface-500 mb-2">
                  <Clock className="inline mr-1" size={14} /> Fecha de Fin
                </p>
                <p className="text-lg font-semibold text-surface-900">{formatDate(evento.fechaFin)}</p>
              </div>
            )}
            {evento.lugar && (
              <div className="sm:col-span-2">
                <p className="text-sm font-semibold text-surface-500 mb-2">
                  <MapPin className="inline mr-1" size={14} /> Ubicación
                </p>
                <p className="text-lg text-surface-900">{evento.lugar}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-surface-900 mb-3">Descripción del Evento</h3>
            <p className="text-surface-700 leading-relaxed whitespace-pre-line">{evento.descripcion}</p>
          </div>

          <button onClick={onClose} className="btn-secondary w-full mt-6">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function EventosPage() {
  const [eventos,          setEventos]          = useState([]);
  const [loading,          setLoading]           = useState(true);
  const [searchTerm,       setSearchTerm]        = useState('');
  const [filtroTipo,       setFiltroTipo]        = useState('todos');
  const [filtroModalidad,  setFiltroModalidad]   = useState('todos');
  const [selectedEvento,   setSelectedEvento]    = useState(null);

  useEffect(() => { loadEventos(); }, []);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/eventos/proximos');
      setEventos(response.data || []);
    } catch (err) {
      console.error('Error cargando eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  /* Tipos y modalidades que realmente existen en los datos del backend */
  const tiposDisponibles = useMemo(
    () => [...new Set(eventos.map(e => e.tipo))].sort(),
    [eventos]
  );
  const modalidadesDisponibles = useMemo(
    () => [...new Set(eventos.map(e => e.modalidad))],
    [eventos]
  );

  const filteredEventos = useMemo(() => eventos.filter(e => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      e.titulo.toLowerCase().includes(q) ||
      e.descripcion.toLowerCase().includes(q);
    const matchTipo      = filtroTipo      === 'todos' || e.tipo      === filtroTipo;
    const matchModalidad = filtroModalidad === 'todos' || e.modalidad === filtroModalidad;
    return matchSearch && matchTipo && matchModalidad;
  }), [eventos, searchTerm, filtroTipo, filtroModalidad]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-casatic-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-20">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={casaticLogo} alt="CASATIC" className="h-10 w-auto object-contain mb-5 mx-auto animate-fade-in" />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-casatic-300 bg-white/10 px-3 py-1.5 rounded-full mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
            Calendario de Eventos 2026
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
            Eventos de <span className="text-gradient-accent">CASATIC</span>
          </h1>
          <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Descubre las próximas conferencias, talleres y eventos de networking organizados por nuestros socios
          </p>
        </div>
      </section>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-card p-6 border border-surface-100 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-surface-400" />
            <input
              type="text"
              placeholder="Busca por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Tipo de Evento</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="input-field w-full"
              >
                <option value="todos">Todos los tipos</option>
                {tiposDisponibles.map(tipo => (
                  <option key={tipo} value={tipo}>{TIPO_LABELS[tipo] || tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Modalidad</label>
              <select
                value={filtroModalidad}
                onChange={(e) => setFiltroModalidad(e.target.value)}
                className="input-field w-full"
              >
                <option value="todos">Todas las modalidades</option>
                {modalidadesDisponibles.map(mod => (
                  <option key={mod} value={mod}>{MODALIDAD_LABELS[mod] || mod}</option>
                ))}
              </select>
            </div>
          </div>

          {(filtroTipo !== 'todos' || filtroModalidad !== 'todos' || searchTerm) && (
            <button
              onClick={() => { setFiltroTipo('todos'); setFiltroModalidad('todos'); setSearchTerm(''); }}
              className="text-sm text-casatic-600 hover:underline flex items-center gap-1"
            >
              <X size={14} /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
          </div>
        ) : filteredEventos.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-surface-300" />
            <h3 className="text-xl font-bold text-surface-700 mb-2">No se encontraron eventos</h3>
            <p className="text-surface-600">
              {eventos.length === 0
                ? 'Próximamente habrá eventos disponibles.'
                : 'Intenta con otros términos de búsqueda o filtros.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-surface-600 mb-6">
              Mostrando <span className="font-semibold">{filteredEventos.length}</span> evento{filteredEventos.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEventos.map(evento => (
                <div key={evento.id} onClick={() => setSelectedEvento(evento)} className="cursor-pointer">
                  <EventoCard evento={evento} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <EventoDetailModal evento={selectedEvento} onClose={() => setSelectedEvento(null)} />
    </div>
  );
}

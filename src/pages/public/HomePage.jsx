import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Search, Building2, Globe, ShieldCheck, ArrowRight,
  Zap, Users, BarChart3, CheckCircle, Star
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({ totalSocios: 0, totalEmpresas: 0 });

  useEffect(() => {
    api.get('/directorio?page=1&pageSize=1').then((res) => {
      setStats({ totalSocios: res.data.total, totalEmpresas: res.data.total });
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Directorio Interactivo CASATIC 2026
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Conecta con los socios tecnológicos y empresas asociadas más relevantes del ecosistema.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/directorio"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Explorar Directorio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-blue-500 rounded-3xl p-8 shadow-xl">
                <Building2 className="w-32 h-32 text-blue-200 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalSocios}+
              </div>
              <p className="text-gray-600">Socios registrados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                25+
              </div>
              <p className="text-gray-600">Especialidades diferentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
              <Search className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Búsqueda Avanzada</h3>
              <p className="text-gray-600">Encuentra socios por especialidad, sector o ubicación con filtros potentes.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
              <Globe className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Información Completa</h3>
              <p className="text-gray-600">Accede a perfiles detallados con sitios web, contactos y descripciones.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confíable</h3>
              <p className="text-gray-600">Información verificada de socios y empresas asociadas de confianza.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para conectar?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Accede al directorio completo y descubre oportunidades de colaboración.
          </p>
          <Link
            to="/directorio"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ir al Directorio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

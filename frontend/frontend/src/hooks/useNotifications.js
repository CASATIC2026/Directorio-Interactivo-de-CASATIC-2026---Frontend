import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const POLL_INTERVAL = 30000; // 30s

function getStorageKey(userId) {
  return `casatic_notif_seen_${userId}`;
}

function loadSeen(userId) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId)) || '{}');
  } catch {
    return {};
  }
}

function saveSeen(userId, seen) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(seen));
}

export function useNotifications(user) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const isAdmin = user.rol === 'Admin';
      const seen = loadSeen(user.id);
      const items = [];

      if (isAdmin) {
        // Formularios de contacto
        const [formRes, factRes] = await Promise.allSettled([
          api.get('/formulariocontacto', { params: { page: 1, pageSize: 10 } }),
          api.get('/facturacion', { params: { page: 1, pageSize: 10 } }),
        ]);

        if (formRes.status === 'fulfilled') {
          const forms = formRes.value.data?.items || formRes.value.data || [];
          forms.slice(0, 5).forEach((f) => {
            items.push({
              id: `form_${f.id}`,
              type: 'formulario',
              title: 'Nuevo formulario recibido',
              body: f.nombre || f.asunto || 'Contacto general',
              timestamp: f.creadoEn || f.fecha || new Date().toISOString(),
              read: !!seen[`form_${f.id}`],
            });
          });
        }

        if (factRes.status === 'fulfilled') {
          const facts = factRes.value.data?.items || factRes.value.data || [];
          facts.slice(0, 5).forEach((f) => {
            items.push({
              id: `fact_${f.id}`,
              type: 'factura',
              title: 'Nueva factura registrada',
              body: f.concepto || f.descripcion || `#${f.numero || f.id}`,
              timestamp: f.creadoEn || f.fecha || new Date().toISOString(),
              read: !!seen[`fact_${f.id}`],
            });
          });
        }
      } else {
        // Socio: solo sus formularios y facturas
        const [formRes, factRes] = await Promise.allSettled([
          api.get('/formulariocontacto', { params: { page: 1, pageSize: 10 } }),
          api.get('/facturacion', { params: { page: 1, pageSize: 10 } }),
        ]);

        if (formRes.status === 'fulfilled') {
          const forms = formRes.value.data?.items || formRes.value.data || [];
          forms.slice(0, 5).forEach((f) => {
            items.push({
              id: `form_${f.id}`,
              type: 'formulario',
              title: 'Formulario recibido',
              body: f.nombre || f.asunto || 'Nuevo contacto',
              timestamp: f.creadoEn || f.fecha || new Date().toISOString(),
              read: !!seen[`form_${f.id}`],
            });
          });
        }

        if (factRes.status === 'fulfilled') {
          const facts = factRes.value.data?.items || factRes.value.data || [];
          facts.slice(0, 5).forEach((f) => {
            items.push({
              id: `fact_${f.id}`,
              type: 'factura',
              title: 'Factura actualizada',
              body: f.concepto || f.descripcion || `#${f.numero || f.id}`,
              timestamp: f.creadoEn || f.fecha || new Date().toISOString(),
              read: !!seen[`fact_${f.id}`],
            });
          });
        }
      }

      // Sort by timestamp desc
      items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(items.slice(0, 8));
      setUnreadCount(items.filter((n) => !n.read).length);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.rol]);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const markAllRead = useCallback(() => {
    if (!user?.id) return;
    const seen = loadSeen(user.id);
    notifications.forEach((n) => { seen[n.id] = true; });
    saveSeen(user.id, seen);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [user?.id, notifications]);

  return { notifications, unreadCount, loading, markAllRead, refresh: fetchNotifications };
}

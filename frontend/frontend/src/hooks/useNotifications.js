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

  const storageKey = user?.id || user?.email;

  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const isAdmin = user.rol === 'Admin';
      const seen = loadSeen(storageKey);
      const items = [];

      if (isAdmin) {
        const [formRes, factRes] = await Promise.allSettled([
          api.get('/formulariocontacto'),
          api.get('/facturacion'),
        ]);

        if (formRes.status === 'fulfilled') {
          const forms = Array.isArray(formRes.value.data) ? formRes.value.data : (formRes.value.data?.items ?? []);
          forms.slice(0, 5).forEach((f) => {
            items.push({
              id: `form_${f.id}`,
              type: 'formulario',
              title: 'Nuevo formulario recibido',
              body: f.nombre ? `${f.nombre}: ${(f.mensaje ?? '').slice(0, 60)}` : (f.asunto || 'Contacto general'),
              timestamp: f.fecha || new Date().toISOString(),
              read: !!seen[`form_${f.id}`],
            });
          });
        }

        if (factRes.status === 'fulfilled') {
          const facts = Array.isArray(factRes.value.data) ? factRes.value.data : (factRes.value.data?.items ?? []);
          facts.filter((f) => f.estado === 'Pendiente').slice(0, 5).forEach((f) => {
            items.push({
              id: `fact_${f.id}`,
              type: 'factura',
              title: 'Factura pendiente de pago',
              body: `${f.planNombre || f.descripcion || `#${f.numero}`} — $${f.total ?? ''}`,
              timestamp: f.fechaEmision || new Date().toISOString(),
              read: !!seen[`fact_${f.id}`],
            });
          });
        }
      } else {
        const [formRes, factRes] = await Promise.allSettled([
          api.get('/formulariocontacto/mi-socio'),
          api.get('/facturacion/mi-factura'),
        ]);

        if (formRes.status === 'fulfilled') {
          const forms = Array.isArray(formRes.value.data) ? formRes.value.data : (formRes.value.data?.items ?? []);
          forms.slice(0, 5).forEach((f) => {
            items.push({
              id: `form_${f.id}`,
              type: 'formulario',
              title: 'Mensaje recibido en tu empresa',
              body: f.nombre ? `${f.nombre}: ${(f.mensaje ?? '').slice(0, 60)}` : 'Nuevo contacto',
              timestamp: f.fecha || new Date().toISOString(),
              read: !!seen[`form_${f.id}`],
            });
          });
        }

        if (factRes.status === 'fulfilled') {
          const raw = factRes.value.data;
          const facts = Array.isArray(raw) ? raw : (raw ? [raw] : []);
          facts.filter((f) => f.estado === 'Pendiente').slice(0, 5).forEach((f) => {
            items.push({
              id: `fact_${f.id}`,
              type: 'factura',
              title: 'Factura pendiente de pago',
              body: `${f.planNombre || f.descripcion || `#${f.numero}`} — $${f.total ?? ''}`,
              timestamp: f.fechaEmision || new Date().toISOString(),
              read: !!seen[`fact_${f.id}`],
            });
          });
        }
      }

      items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(items.slice(0, 8));
      setUnreadCount(items.filter((n) => !n.read).length);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user?.email, user?.rol, storageKey]);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const markAllRead = useCallback(() => {
    if (!storageKey) return;
    const seen = loadSeen(storageKey);
    notifications.forEach((n) => { seen[n.id] = true; });
    saveSeen(storageKey, seen);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [storageKey, notifications]);

  return { notifications, unreadCount, loading, markAllRead, refresh: fetchNotifications };
}

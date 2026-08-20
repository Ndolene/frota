// Service Worker — apenas para receber e mostrar notificações push.
// Fica na raiz do site (ndolene.github.io/frota/sw.js) porque o escopo de um Service Worker
// é limitado à pasta onde o ficheiro está — se ficar dentro de /js, só cobriria /js/*.

self.addEventListener('push', (event) => {
  let dados = {};
  try{ dados = event.data ? event.data.json() : {}; }catch(e){ dados = { titulo:'Gestão de Frota · Ndolene', mensagem: event.data ? event.data.text() : '' }; }
  const titulo = dados.titulo || 'Gestão de Frota · Ndolene';
  const opcoes = {
    body: dados.mensagem || '',
    icon: dados.icon || '/frota/icon-192.png',
    badge: dados.icon || '/frota/icon-192.png',
    data: { url: dados.url || '/frota/' },
  };
  event.waitUntil(self.registration.showNotification(titulo, opcoes));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/frota/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const c of lista) { if (c.url.includes(url) && 'focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

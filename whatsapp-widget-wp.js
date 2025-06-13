(function () {
  const scripts = document.querySelectorAll('script[src*="whatsapp-widget-wp.js"]');
  const script = scripts[scripts.length - 1];

  const numeroWhatsApp = script?.getAttribute('data-whatsapp') || '5213310000000';
  const emailDestino = script?.getAttribute('data-email') || '';
  const mostrarServicio = script?.getAttribute('data-mostrar-servicio') === 'true';
  const etiquetaServicio = script?.getAttribute('data-etiqueta-servicio') || '¿Qué servicio te interesa?';
  const opcionesServicio = JSON.parse(script?.getAttribute('data-opciones-servicio') || '[]');

  const style = document.createElement('style');
  style.textContent = `/* Aquí va todo tu CSS como en el script original (omitido por brevedad) */`;

  const container = document.createElement('div');
  container.innerHTML = `<!-- Aquí va todo el HTML original (omitido por brevedad) -->`;

  document.addEventListener('DOMContentLoaded', function () {
    document.head.appendChild(style);
    document.body.appendChild(container);

    if (!mostrarServicio) {
      document.getElementById('servicio')?.closest('div')?.remove();
    } else {
      const select = document.getElementById('servicio');
      const label = document.querySelector('label[for="servicio"]');
      if (label) label.textContent = etiquetaServicio;
      if (select && Array.isArray(opcionesServicio)) {
        opcionesServicio.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          select.appendChild(option);
        });
      }
    }

    window.enviarAWhatsApp = function () {
      const nombre = document.getElementById('nombre')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const telefono = document.getElementById('telefono')?.value.trim();
      const servicio = document.getElementById('servicio')?.value.trim();
      const mensaje = document.getElementById('mensaje')?.value.trim();

      const utmParams = new URLSearchParams(window.location.search);
      const utm_source = utmParams.get('utm_source') || '';
      const utm_medium = utmParams.get('utm_medium') || '';
      const utm_campaign = utmParams.get('utm_campaign') || '';

      const mensajeWhatsApp =
        `Hola, me gustaría más información.%0A` +
        `Me llamo: *${nombre}*%0A` +
        `Mi correo es: *${email}*%0A` +
        `Mi teléfono: *${telefono}*%0A` +
        (mostrarServicio ? `Servicio de interés: *${servicio}*%0A` : '') +
        `Mensaje: *${mensaje}*`;

      const data = {
        nombre,
        email,
        telefono,
        servicio,
        mensaje,
        utm_source,
        utm_medium,
        utm_campaign,
        emailDestino
      };

      fetch('/wp-json/wff/v1/enviar-correo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch(err => console.warn('Error al enviar al endpoint de WordPress:', err));

      document.getElementById('form-container')?.classList.remove('show');
      const url = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
      window.open(url, '_blank');
    };
  });
})();

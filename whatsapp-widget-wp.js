(function () {
  const scripts = document.querySelectorAll('script[src*="whatsapp-widget-wp.js"]');
  const script = scripts[scripts.length - 1];

  const numeroWhatsApp = script?.getAttribute('data-whatsapp') || '5213310000000';
  const emailDestino = script?.getAttribute('data-email') || '';
  const mostrarServicio = script?.getAttribute('data-mostrar-servicio') === 'true';
  const etiquetaServicio = script?.getAttribute('data-etiqueta-servicio') || '¿Qué servicio te interesa?';
  const opcionesServicio = JSON.parse(script?.getAttribute('data-opciones-servicio') || '[]');

  const style = document.createElement('style');
  style.textContent = `
    #whatsapp-float {
      position: fixed;
      bottom: 40px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #25d366;
      color: white;
      font-size: 24px;
      border: none;
      z-index: 9999;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    }

    #form-container {
      position: fixed;
      bottom: 110px;
      right: 20px;
      width: 300px;
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      z-index: 9999;
      display: none;
      font-family: sans-serif;
    }

    #form-container.show {
      display: block;
    }

    #form-container input, #form-container select, #form-container textarea {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 14px;
    }

    #form-container button {
      background: #25d366;
      color: white;
      border: none;
      padding: 10px;
      width: 100%;
      border-radius: 5px;
      cursor: pointer;
    }
  `;

  const container = document.createElement('div');
  container.innerHTML = `
    <button id="whatsapp-float" data-gtm-click="whatsapp-float">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 448 512"><path fill="white" d="M380.9 97.1C339 ..."/></svg>
    </button>
    <div id="form-container">
      <input type="text" id="nombre" placeholder="Tu nombre" required />
      <input type="email" id="email" placeholder="Tu correo electrónico" required />
      <input type="tel" id="telefono" placeholder="Tu teléfono" required />
      <div>
        <label for="servicio">${etiquetaServicio}</label>
        <select id="servicio"></select>
      </div>
      <textarea id="mensaje" placeholder="Escribe tu mensaje"></textarea>
      <button onclick="enviarAWhatsApp()">Enviar mensaje</button>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', function () {
    document.head.appendChild(style);
    document.body.appendChild(container);

    const formContainer = document.getElementById('form-container');
    const floatButton = document.getElementById('whatsapp-float');
    floatButton.addEventListener('click', () => {
      formContainer.classList.toggle('show');
    });

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

      formContainer.classList.remove('show');
      const url = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
      window.open(url, '_blank');
    };
  });
})();

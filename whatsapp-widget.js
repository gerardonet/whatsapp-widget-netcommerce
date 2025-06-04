(function () {
  // Detectar el script actual de forma segura
  const scripts = document.querySelectorAll('script[src*="whatsapp-widget.js"]');
  const script = scripts[scripts.length - 1];

  // Leer configuraciones del script o usar valores por defecto
  const numeroWhatsApp = script?.getAttribute('data-whatsapp') || '5213312416499';
  const zapierURL = script?.getAttribute('data-zapier') || '';

  // Estilos inyectados
  const style = document.createElement('style');
  style.textContent = `/* todo tu CSS aquí (ya incluido en tu versión anterior) */`;
  document.head.appendChild(style);

  // HTML del widget
  const container = document.createElement('div');
  container.innerHTML = `<!-- tu HTML completo: botón, formulario, inputs, etc. -->`;
  document.body.appendChild(container);

  // Funciones globales necesarias para el HTML
  window.toggleFormulario = function () {
    document.getElementById('form-container')?.classList.toggle('show');
  };

  window.verificarCampos = function () {
    const nombre = document.getElementById('nombre')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const servicio = document.getElementById('servicio')?.value.trim();
    const mensaje = document.getElementById('mensaje')?.value.trim();
    const boton = document.getElementById('submit-whatsapp');

    const emailValido = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    const telefonoValido = /^[0-9]{10}$/.test(telefono);
    const todosValidos = nombre && emailValido && telefonoValido && servicio && mensaje;

    if (boton) boton.disabled = !todosValidos;
  };

  window.validarEmail = function () {
    const email = document.getElementById('email');
    const error = document.getElementById('email-error');
    const valido = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email?.value.trim());

    if (email && error) {
      error.style.display = !valido && email.value.trim() ? 'block' : 'none';
      email.classList.toggle('error', !valido && email.value.trim());
    }
  };

  window.validarTelefono = function () {
    const tel = document.getElementById('telefono');
    const error = document.getElementById('telefono-error');
    const valido = /^[0-9]{10}$/.test(tel?.value.trim());

    if (tel && error) {
      error.style.display = !valido && tel.value.trim() ? 'block' : 'none';
      tel.classList.toggle('error', !valido && tel.value.trim());
    }
  };

  window.validarServicio = function () {
    const select = document.getElementById('servicio');
    const error = document.getElementById('servicio-error');
    const valido = select?.value.trim() !== '';

    if (select && error) {
      error.style.display = !valido ? 'block' : 'none';
      select.classList.toggle('error', !valido);
    }
  };

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

    const mensajeWhatsApp = \`Hola, me gustaría más información.%0A\` +
                            \`Me llamo: *\${nombre}*%0A\` +
                            \`Mi correo es: *\${email}*%0A\` +
                            \`Mi teléfono: *\${telefono}*%0A\` +
                            \`Servicio de interés: *\${servicio}*%0A\` +
                            \`Mensaje: *\${mensaje}*\`;

    const data = new URLSearchParams({
      nombre,
      email,
      telefono,
      servicio,
      mensaje,
      utm_source,
      utm_medium,
      utm_campaign
    });

    // Solo enviar si se definió un Zapier webhook
    if (zapierURL) {
      fetch(zapierURL, {
        method: "POST",
        body: data
      }).catch((err) => console.warn('Zapier fetch failed:', err));
    }

    document.getElementById("form-container")?.classList.remove("show");

    const url = \`https://wa.me/\${numeroWhatsApp}?text=\${mensajeWhatsApp}\`;
    window.open(url, "_blank");
  };
})();

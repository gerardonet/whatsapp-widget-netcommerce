(function () {
  const scripts = document.querySelectorAll('script[src*="whatsapp-widget-wp.js"]');
  const script = scripts[scripts.length - 1];

  const numeroWhatsApp = script?.getAttribute('data-whatsapp') || '5213312416499';
  const emailDestino = script?.getAttribute('data-email') || '';
  const mostrarServicio = script?.getAttribute('data-mostrar-servicio') === 'true';
  const etiquetaServicio = script?.getAttribute('data-etiqueta-servicio') || '¿Qué servicio te interesa?';
  const opcionesServicio = JSON.parse(script?.getAttribute('data-opciones-servicio') || '[]');

  const style = document.createElement('style');
  style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#whatsapp-float {
  position: fixed;
  bottom: 40px;
  right: 20px;
  background-color: transparent;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
#whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
#whatsapp-float:hover svg circle {
  fill: #128C7E !important;
}

#form-container {
  position: fixed;
  bottom: 110px;
  right: 20px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 320px;
  width: 90%;
  font-family: sans-serif;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  z-index: 10000;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  pointer-events: none;
  visibility: hidden;
}
#form-container.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  visibility: visible;
}
#form-container input,
#form-container select,
#form-container textarea {
  color: #000;
  width: 100%;
  margin-bottom: 5px;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;
  line-height: 20px;
}
#form-container input.error,
#form-container textarea.error,
#form-container select.error {
  border-color: red;
}
#form-container input, #form-container select {
    height: 50px;
}
.error-text {
  color: red;
  font-size: 12px;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
  display: none;
}
#form-container textarea {
  resize: vertical;
}
#submit-whatsapp:disabled {
  background-color: #ccc !important;
  cursor: not-allowed;
  color: #666;
}
#submit-whatsapp {
  background-color: #25D366;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}
#cerrar-formulario {
  position: absolute;
  top: 14px;
  right: 16px;
  background: transparent;
  border: none;
  padding: 5px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  z-index: 10001;
}
#cerrar-formulario svg {
  width: 100%;
  height: 100%;
  fill: #555;
  transition: fill 0.2s ease;
}
#cerrar-formulario:hover svg {
  fill: #000;
}`;

  const container = document.createElement('div');
  container.innerHTML = `
<button id="whatsapp-float" class="FormularioWhatsapp" data-gtm-click="whatsapp-float" onclick="toggleFormulario()">
  <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 800 800"><circle cx="400" cy="400" r="400" style="fill:#25d366"/><path d="..."/></svg>
</button>
<div id="form-container">
  <button id="cerrar-formulario" onclick="toggleFormulario()" aria-label="Cerrar formulario">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="..."/>
    </svg>
  </button>
  <h4 style="margin-top:0; color:#000; font-size:15px; font-weight:400;text-transform: none;max-width: 85%;font-family: 'Poppins', sans-serif;">
    Compártenos tus datos para brindarte un mejor servicio.
  </h4>
  <input type="text" id="nombre" placeholder="Tu nombre" oninput="verificarCampos()">
  <input type="email" id="email" placeholder="Tu email" oninput="verificarCampos()" onblur="validarEmail()">
  <div id="email-error" class="error-text">Por favor ingresa un correo válido.</div>
  <input type="tel" id="telefono" placeholder="Tu teléfono" oninput="verificarCampos()" onblur="validarTelefono()">
  <div id="telefono-error" class="error-text">El teléfono debe tener exactamente 10 dígitos.</div>
  <select id="servicio" onchange="verificarCampos()" onblur="validarServicio()"></select>
  <div id="servicio-error" class="error-text">Por favor selecciona un servicio.</div>
  <textarea id="mensaje" rows="3" placeholder="Cuéntanos en qué podemos ayudarte" oninput="verificarCampos()"></textarea>
  <button id="submit-whatsapp" class="AbrirWhatsapp" onclick="enviarAWhatsApp()" disabled>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:20px; height:20px; vertical-align:middle; margin-right:3px;margin-bottom:2px; fill:currentColor;">
      <path d="..."/>
    </svg>
    Abrir WhatsApp
  </button>
</div>`;

  document.addEventListener('DOMContentLoaded', function () {
    document.head.appendChild(style);
    document.body.appendChild(container);

    if (!mostrarServicio) {
      document.getElementById('servicio')?.closest('div')?.remove();
    } else {
      const select = document.getElementById('servicio');
      if (select && Array.isArray(opcionesServicio)) {
        select.innerHTML = `<option value="">- ${etiquetaServicio} -</option>`;
        opcionesServicio.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          select.appendChild(option);
        });
      }
    }

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
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const telefonoValido = /^[0-9]{10}$/.test(telefono);
      const todosValidos = nombre && emailValido && telefonoValido && (!mostrarServicio || servicio) && mensaje;
      if (boton) boton.disabled = !todosValidos;
    };

    window.validarEmail = function () {
      const email = document.getElementById('email');
      const error = document.getElementById('email-error');
      const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.value.trim());
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(err => console.warn('Error al enviar al endpoint de WordPress:', err));

      document.getElementById('form-container')?.classList.remove('show');
      const url = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
      window.open(url, '_blank');
    };
  });
})();

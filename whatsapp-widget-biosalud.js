(function () {
  var s = document.createElement("script");
  s.src = "https://whatsapp-widget-central.pages.dev/whatsapp-widget-cloudflare.js";
  s.defer = true;

  s.setAttribute("data-site-id", "itb");

  s.setAttribute("data-config-endpoint", "https://whatsapp-widget-central.pages.dev/api/config");
  s.setAttribute("data-lead-endpoint", "https://whatsapp-widget-central.pages.dev/api/lead");
  s.setAttribute("data-heartbeat-endpoint", "https://whatsapp-widget-central.pages.dev/api/heartbeat");
  s.setAttribute("data-css-href", "https://whatsapp-widget-central.pages.dev/whatsapp-widget.css");

  var target = document.head || document.documentElement || document.body;
  target.appendChild(s);
})();

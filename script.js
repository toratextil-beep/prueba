/*
  Este archivo hace que la página funcione. No hace falta que lo
  edites para cargar nuevos diseños (eso se hace en catalog.js).
*/

const design = CATALOG.designs[0]; // por ahora mostramos el primer diseño del catálogo
const pay = CATALOG.paymentInfo;

let activeZone = design.zones[0].id;
let zoneColors = {}; // guarda el color elegido para cada zona
let activeSizeIndex = 0;
let activeMethod = "transfer";

const svgContainer = document.getElementById("svg-container");
const zonePillsEl = document.getElementById("zone-pills");
const swatchesEl = document.getElementById("swatches");
const sizeOptionsEl = document.getElementById("size-options");

function formatARS(n) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

// 1. Cargar el SVG del diseño e inyectarlo en la página
fetch(design.svgFile)
  .then((res) => res.text())
  .then((svgText) => {
    svgContainer.innerHTML = svgText;

    // Guardamos el color original de cada zona como punto de partida.
    // Si el color viene de una clase CSS (típico al exportar desde
    // Illustrator), lo leemos con getComputedStyle en vez del atributo.
    design.zones.forEach((zone) => {
      const el = document.getElementById(zone.id);
      if (el) {
        const target = el.tagName.toLowerCase() === "g" ? el.querySelector("*") : el;
        zoneColors[zone.id] = target ? getComputedStyle(target).fill : "#000000";
      }
    });

    buildZonePills();
    buildSwatches();
  });

// 2. Construir los botones de "qué parte pintar"
function buildZonePills() {
  zonePillsEl.innerHTML = "";
  design.zones.forEach((zone) => {
    const pill = document.createElement("div");
    pill.className = "zone-pill" + (zone.id === activeZone ? " active" : "");
    pill.textContent = zone.label;
    pill.addEventListener("click", () => {
      activeZone = zone.id;
      buildZonePills();
      buildSwatches();
    });
    zonePillsEl.appendChild(pill);
  });
}

// 3. Construir los círculos de color
function buildSwatches() {
  swatchesEl.innerHTML = "";
  design.colorOptions.forEach((color) => {
    const sw = document.createElement("div");
    sw.className = "swatch";
    sw.style.background = color.hex;
    sw.title = color.name;
    if (zoneColors[activeZone] === color.hex) sw.classList.add("active");

    sw.addEventListener("click", () => {
      applyColor(activeZone, color.hex);
      buildSwatches();
    });

    swatchesEl.appendChild(sw);
  });
}

// 4. Aplicar el color elegido a la zona del SVG
//
// Nota: los archivos que exporta Illustrator suelen definir el color
// con una "clase" de CSS (algo como class="cls-3") en vez de un
// atributo fill="..." directo. Si solo cambiáramos el atributo fill,
// esa clase CSS seguiría ganando y no se vería el cambio. Por eso acá
// además borramos la clase y aplicamos el color como estilo directo.
function paintElement(el, hex) {
  el.removeAttribute("class");
  el.style.setProperty("fill", hex, "important");
}

function applyColor(zoneId, hex) {
  zoneColors[zoneId] = hex;
  const el = document.getElementById(zoneId);
  if (el) {
    paintElement(el, hex);
    // si la zona es un grupo (varias formas adentro), pintamos cada una
    el.querySelectorAll("*").forEach((child) => paintElement(child, hex));
  }
}

// 5. Construir las opciones de tamaño
function buildSizeOptions() {
  sizeOptionsEl.innerHTML = "";
  design.sizes.forEach((size, index) => {
    const opt = document.createElement("div");
    opt.className = "size-option" + (index === activeSizeIndex ? " active" : "");
    opt.innerHTML = `<span>${size.label}</span><span class="size-price">${formatARS(size.price)}</span>`;
    opt.addEventListener("click", () => {
      activeSizeIndex = index;
      buildSizeOptions();
      updatePrice();
    });
    sizeOptionsEl.appendChild(opt);
  });
}

// 6. Actualizar precio según tamaño y método de pago
function updatePrice() {
  const size = design.sizes[activeSizeIndex];
  const priceMain = document.getElementById("price-main");
  const priceSub = document.getElementById("price-sub");

  document.getElementById("design-name").textContent = design.name;
  document.getElementById("design-description").textContent = design.description;
  document.getElementById("caption-name").textContent = design.name;
  document.getElementById("caption-size").textContent = size.label;

  if (activeMethod === "transfer") {
    const finalPrice = size.price * (1 - pay.transferDiscount);
    priceMain.textContent = formatARS(finalPrice);
    priceSub.textContent = `Precio de lista ${formatARS(size.price)} · ${pay.transferDiscount * 100}% off por transferencia`;
  } else {
    priceMain.textContent = formatARS(size.price);
    const cuota = size.price / pay.cuotasUala;
    priceSub.textContent = `${pay.cuotasUala} cuotas de ${formatARS(cuota)} sin interés con tarjeta Ualá`;
  }

  updatePaymentDetail();
}

// 7. Mostrar los datos según el método de pago elegido
function updatePaymentDetail() {
  const box = document.getElementById("payment-detail");
  const size = design.sizes[activeSizeIndex];

  if (activeMethod === "transfer") {
    const finalPrice = size.price * (1 - pay.transferDiscount);
    box.innerHTML = `
      <div class="row"><span>Alias</span><span>${pay.alias}</span></div>
      <div class="row"><span>CBU</span><span>${pay.cbu}</span></div>
      <div class="row"><span>Titular</span><span>${pay.titular}</span></div>
      <div class="row"><span>Monto a transferir</span><span>${formatARS(finalPrice)}</span></div>
      <div class="payment-note">Una vez hecha la transferencia, enviá el comprobante para confirmar el pedido.</div>
    `;
  } else {
    const cuota = size.price / pay.cuotasUala;
    box.innerHTML = `
      <div class="row"><span>Total</span><span>${formatARS(size.price)}</span></div>
      <div class="row"><span>Cuotas</span><span>${pay.cuotasUala} de ${formatARS(cuota)}</span></div>
      <div class="payment-note">El pago con tarjeta se procesa a través de Ualá. Vas a completar los datos de tu tarjeta en el siguiente paso.</div>
    `;
  }
}

// 8. Manejo de las pestañas de método de pago
document.getElementById("payment-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".payment-tab");
  if (!tab) return;
  activeMethod = tab.dataset.method;
  document.querySelectorAll(".payment-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  updatePrice();
});

// Arranque
buildSizeOptions();
updatePrice();

/*
  ============================================================
  CATÁLOGO — este es el único archivo que vas a tocar seguido.
  ============================================================
  Acá cargás tus diseños, tamaños, precios y colores.
  No hace falta saber programar: solo copiar el patrón que ya
  está armado y cambiar los datos (nombre, precio, colores, etc).

  Cosas importantes:
  - Cada diseño tiene un "svgFile" que apunta a un archivo SVG
    dentro de la carpeta /designs.
  - Dentro de ese SVG, cada zona pintable tiene un "id" (por eso
    "zones" abajo hace referencia a esos mismos ids).
  - Los precios van sin puntos ni comas, solo números.
  ============================================================
*/

const CATALOG = {

  // Datos para el pago por transferencia. Reemplazá por los tuyos.
  paymentInfo: {
    transferDiscount: 0.25, // 25% off — cambiar acá si el % cambia
    alias: "MI.ALIAS.ALFOMBRAS", // COMPLETAR con tu alias real
    cbu: "0000003100000000000000", // COMPLETAR con tu CBU real
    titular: "NOMBRE Y APELLIDO", // COMPLETAR
    cuotasUala: 3, // cantidad de cuotas sin interés vía Ualá
  },

  designs: [
    {
      id: "diseno-1",
      name: "Diseño 1",
      svgFile: "designs/1.svg",
      description: "Tu primer diseño, vectorizado desde Illustrator. Revisá que los nombres de zona (abajo) coincidan con las partes reales del dibujo, y cambialos si hace falta.",

      // Las "zonas" son los id= que están adentro del archivo SVG.
      // En tu diseño, Illustrator les puso estos nombres automáticamente
      // (vienen de las capas que tenías en Photoshop). "label" es el
      // nombre en criollo que va a ver el cliente en el sitio.
      zones: [
        { id: "_1_Imagen", label: "Contorno" },
        { id: "_2_Imagen", label: "Borde" },
        { id: "_5_Imagen", label: "Fondo" },
        { id: "_4_Imagen", label: "Detalles claros" },
        { id: "_3_Imagen", label: "Medallón" },
      ],

      // Paletas de colores que el cliente puede aplicar a cada zona.
      // Podés poner tantos colores como quieras acá.
      colorOptions: [
        { name: "Crema",      hex: "#F0E6D2" },
        { name: "Latón",      hex: "#B08D45" },
        { name: "Esmeralda",  hex: "#0B5D3B" },
        { name: "Borgoña",    hex: "#6B1E2B" },
        { name: "Chocolate",  hex: "#4A2C1F" },
        { name: "Azul Francia", hex: "#2C5FCC" },
        { name: "Coral",      hex: "#F4623A" },
        { name: "Mostaza",    hex: "#E8A93C" },
        { name: "Fucsia",     hex: "#D6336C" },
      ],

      // Tamaños disponibles y su precio en pesos argentinos (precio de lista).
      sizes: [
        { label: "Chico — 1.20 x 1.70 m",  price: 185000 },
        { label: "Mediano — 2.00 x 2.50 m", price: 265000 },
        { label: "Grande — 2.50 x 3.50 m",  price: 340000 },
      ],
    },

    // Para agregar un segundo diseño, copiá todo el bloque de arriba
    // (desde { id: "design-01"... hasta el }, ) y pegalo acá abajo,
    // cambiando el id, el nombre, el svgFile y los datos.
  ],
};

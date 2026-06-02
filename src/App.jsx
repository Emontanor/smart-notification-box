import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import "./App.css";

const MQTT_URL =
  "wss://ba1eb9a14c704614ab075e35893dee5d.s1.eu.hivemq.cloud:8884/mqtt";

const MQTT_OPTIONS = {
  username: "Front",
  password: "Fhm1qazz",
};

const TOPIC = "smartbox/eventos";
const GRID_SIZE = 16;
const TOTAL_PIXELS = GRID_SIZE * GRID_SIZE;
const MESSAGE_LIMIT = 60;

const SONGS = [
  "Que vuelta vox",
  "El Hexxo",
  "La mejor musica",
  "Medellin Takai",
  "TRANKAITO",
  "Boleritoxx",
  "SE LO JURO MOR",
];

const PALETTE = [
  { id: 0, name: "Negro", color: "#020617" },
  { id: 1, name: "Rojo", color: "#ef4444" },
  { id: 2, name: "Verde", color: "#22c55e" },
  { id: 3, name: "Azul", color: "#3b82f6" },
  { id: 4, name: "Amarillo", color: "#facc15" },
  { id: 5, name: "Blanco", color: "#f8fafc" },
  { id: 6, name: "Cian", color: "#06b6d4" },
  { id: 7, name: "Magenta", color: "#d946ef" },
  { id: 8, name: "Gris", color: "#64748b" },
  { id: 9, name: "Marrón", color: "#78350f" },
  { id: 10, name: "Naranja", color: "#f97316" },
];

const createBitmap = (rows) => rows.join("").split("").map(Number);

const PRESETS = [
  {
    id: "happy",
    name: "Cara feliz",
    // Centrada, ojos estilizados de 2x2 y una sonrisa curva natural con esquinas.
    bitmap: createBitmap([
      "0000000000000000",
      "0000055555500000",
      "0005544444455000",
      "0054444444444500",
      "0544444444444450",
      "0544004444004450",
      "0544004444004450",
      "0544444444444450",
      "0544444444444450",
      "0544544444454450",
      "0544455555544450",
      "0054445555444500",
      "0005544444455000",
      "0000055555500000",
      "0000000000000000",
      "0000000000000000",
    ]),
  },
  {
    id: "heart",
    name: "Corazon",
    // Un corazón clásico de RPG. Proporciones perfectas y un toque de brillo blanco (5) arriba a la izquierda.
    bitmap: createBitmap([
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0001110000111000",
      "0011511001111100",
      "0111511111111110",
      "0111111111111110",
      "0111111111111110",
      "0011111111111100",
      "0001111111111000",
      "0000111111110000",
      "0000011111100000",
      "0000001111000000",
      "0000000110000000",
      "0000000000000000",
      "0000000000000000",
    ]),
  },
  {
    id: "sad",
    name: "Cara triste",
    // Azulada y con una sutil lágrima cayendo del ojo izquierdo para máxima expresividad de 8 bits.
    bitmap: createBitmap([
      "0000000000000000",
      "0000033333300000",
      "0003366666633000",
      "0036666666666300",
      "0366666666666630",
      "0366006666006630",
      "0366006666006630",
      "0366566666666630",
      "0365666666666630",
      "0365600000066630",
      "0366006666006630",
      "0036666666666300",
      "0003366666633000",
      "0000033333300000",
      "0000000000000000",
      "0000000000000000",
    ]),
  },
  {
    id: "warning",
    name: "Advertencia",
    // Triángulo perfectamente escalado con un borde negro nítido, fondo amarillo y el signo de exclamación bien definido.
    bitmap: createBitmap([
      "0000000000000000",
      "0000000550000000",
      "0000005445000000",
      "0000054554500000",
      "0000544004450000",
      "0005444004445000",
      "0054444004444500",
      "0544444004444450",
      "0544444004444450",
      "0544444444444450",
      "0054444554444500",
      "0005444004445000",
      "0000544004450000",
      "0000055445500000",
      "0000000550000000",
      "0000000000000000",
    ]),
  },
  {
    id: "tree",
    name: "Arbol de navidad",
    // Árbol geométrico con una estrella amarilla arriba, follaje verde escalonado, esferas rojas/magentas y un tronco marrón (9).
    bitmap: createBitmap([
      "0000000440000000",
      "0000004444000000",
      "0000000220000000",
      "0000002222000000",
      "0000021227200000",
      "0000222222220000",
      "0000022122200000",
      "0000222222220000",
      "0002272221222000",
      "0022222222222200",
      "0000221227220000",
      "0022222222222200",
      "0222222222222220",
      "0000009999000000",
      "0000009999000000",
      "0000009999000000",
    ]),
  },
  {
    id: "landscape",
    name: "Paisaje",
    // Cielo azul (3), un sol brillante (4), dos montañas verdes (2) con picos nevados (5) y tierra fértil abajo.
    bitmap: createBitmap([
      "3333333333333333",
      "3444333333333333",
      "4444433333333333",
      "4444433333333333",
      "3444333333333333",
      "3333333333353333",
      "3333333333555333",
      "3333335333525333",
      "3333355533222333",
      "3333522253222333",
      "3335222225222233",
      "3352222222222223",
      "3522222222222222",
      "2222222222222222",
      "9999999999999999",
      "9999999999999999",
    ]),
  },
  {
    id: "gift",
    name: "Regalo",
    // Caja roja llamativa con un listón y lazo amarillo (4) perfectamente centrado en cruz.
    bitmap: createBitmap([
      "0000000000000000",
      "0000044004400000",
      "0000444444440000",
      "0000444444440000",
      "0000044004400000",
      "0011111441111100",
      "0111111441111110",
      "0111111441111110",
      "0144444444444410",
      "0144444444444410",
      "0111111441111110",
      "0111111441111110",
      "0111111441111110",
      "0111111441111110",
      "0011111441111100",
      "0000000000000000",
    ]),
  },
  {
    id: "star",
    name: "Estrella",
    // Silueta simétrica de estrella de 4 puntas principales y diagonales cortas, estilo RPG clásico, usando amarillo (4) y destellos blancos (5).
    bitmap: createBitmap([
      "0000000440000000",
      "0000004554000000",
      "0000004554000000",
      "0000044554400000",
      "0044444444444400",
      "0455554444555540",
      "0045544444455400",
      "0004444444444000",
      "0004444444444000",
      "0045544444455400",
      "0455554444555540",
      "0044444444444400",
      "0000044554400000",
      "0000004554000000",
      "0000004554000000",
      "0000000440000000",
    ]),
  },
];

const DEFAULT_BITMAP = PRESETS[0].bitmap;

function App() {
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Conectando");
  const [mensaje, setMensaje] = useState("Estaba pensando en ti");
  const [audio, setAudio] = useState(1);
  const [bitmap, setBitmap] = useState(DEFAULT_BITMAP);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].id);
  const [selectedColor, setSelectedColor] = useState(1);
  const isPaintingRef = useRef(false);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_URL, MQTT_OPTIONS);

    mqttClient.on("connect", () => setConnectionStatus("Conectado"));
    mqttClient.on("reconnect", () => setConnectionStatus("Reconectando"));
    mqttClient.on("close", () => setConnectionStatus("Desconectado"));
    mqttClient.on("error", () => setConnectionStatus("Error de conexion"));

    setClient(mqttClient);

    return () => {
      mqttClient.end(true);
    };
  }, []);

  const paintPixel = (index) => {
    setBitmap((currentBitmap) => {
      if (currentBitmap[index] === selectedColor) {
        return currentBitmap;
      }

      const nextBitmap = [...currentBitmap];
      nextBitmap[index] = selectedColor;
      return nextBitmap;
    });
  };

  const startPainting = (index) => {
    isPaintingRef.current = true;
    setSelectedPreset("");
    paintPixel(index);
  };

  const handlePointerEnter = (index) => {
    if (isPaintingRef.current) {
      paintPixel(index);
    }
  };

  const stopPainting = () => {
    isPaintingRef.current = false;
  };

  const clearBitmap = () => {
    setSelectedPreset("");
    setBitmap(Array(TOTAL_PIXELS).fill(0));
  };

  const loadDemo = () => {
    setSelectedPreset(PRESETS[0].id);
    setBitmap(DEFAULT_BITMAP);
  };

  const loadPreset = (presetId) => {
    const preset = PRESETS.find((item) => item.id === presetId);

    setSelectedPreset(presetId);

    if (preset) {
      setBitmap(preset.bitmap);
    }
  };

  const enviarMensaje = () => {
    const data = {
      mensaje: mensaje.trim() || "SIN MENSAJE",
      audio: Number(audio),
      bitmap,
      timestamp: Date.now(),
    };

    client?.publish(TOPIC, JSON.stringify(data));
    console.log("Mensaje enviado", data);
    alert("Mensaje enviado al broker MQTT");
  };

  return (
    <div
      className="app"
      onPointerCancel={stopPainting}
      onPointerUp={stopPainting}
    >
      <main className="container">
        <header className="header">
          <div>
            <p className="eyebrow">Buzon de Mensajes</p>
            <h1 className="title">Enviale un mensaje desde cualquier parte</h1>
          </div>

          <div className={`estado ${connectionStatus.toLowerCase()}`}>
            <div className="dot"></div>
            <span className="estado-texto">{connectionStatus}</span>
          </div>
        </header>

        <section className="panel message-panel">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            maxLength={MESSAGE_LIMIT}
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(event) => setMensaje(event.target.value)}
          />
          <span className="character-count">
            {mensaje.length}/{MESSAGE_LIMIT}
          </span>

          <div className="form-row">
            <label htmlFor="audio">Audio</label>
            <select
              id="audio"
              value={audio}
              onChange={(event) => setAudio(event.target.value)}
            >
              {SONGS.map((song, index) => (
                <option key={song} value={index + 1}>
                  {song}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="workspace">
          <div className="toolbar" aria-label="Paleta de colores">
            {PALETTE.map((paletteColor) => (
              <button
                key={paletteColor.id}
                type="button"
                className={`swatch ${
                  selectedColor === paletteColor.id ? "selected" : ""
                }`}
                onClick={() => setSelectedColor(paletteColor.id)}
                title={`${paletteColor.name}: ${paletteColor.id}`}
                aria-label={`${paletteColor.name}: ${paletteColor.id}`}
              >
                <span
                  style={{ backgroundColor: paletteColor.color }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <div className="editor-shell">
            <div
              className="pixel-grid"
              onPointerLeave={stopPainting}
              style={{
                "--grid-size": GRID_SIZE,
              }}
            >
              {bitmap.map((value, index) => {
                const paletteColor = PALETTE[value] ?? PALETTE[0];

                return (
                  <button
                    key={index}
                    type="button"
                    className="pixel"
                    onPointerDown={() => startPainting(index)}
                    onPointerEnter={() => handlePointerEnter(index)}
                    style={{ backgroundColor: paletteColor.color }}
                    title={`Fila ${Math.floor(index / GRID_SIZE) + 1}, Columna ${
                      (index % GRID_SIZE) + 1
                    }: ${value}`}
                    aria-label={`Pixel ${index}: ${value}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="preset-picker">
            <label htmlFor="preset">Modelo prediseñado</label>
            <select
              id="preset"
              value={selectedPreset}
              onChange={(event) => loadPreset(event.target.value)}
            >
              <option value="">Dibujo personalizado</option>
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              onClick={loadDemo}
            >
              Demo
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={clearBitmap}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={enviarMensaje}
              disabled={!client || connectionStatus !== "Conectado"}
            >
              Enviar al ESP32
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

import { useState } from "react";
import mqtt from "mqtt";
import "./App.css";

// ================= MQTT =================
const client = mqtt.connect(
  "wss://ba1eb9a14c704614ab075e35893dee5d.s1.eu.hivemq.cloud:8884/mqtt",
  {
    username: "Front",
    password: "Fhm1qazz",
  },
);

function App() {
  const [mensaje, setMensaje] = useState("");

  //const enviarMensaje = () => {
  //  const data = {
  //    tipo: "mensaje",
  //    texto: mensaje,
  //    timestamp: Date.now(),
  //  };
  //  client.publish("smartbox/eventos", JSON.stringify(data));
  //  console.log("Mensaje enviado");
  //  console.log(data);
  //  alert("Mensaje enviado al broker MQTT");
  //};

  const enviarMensaje = () => {

    // bitmap 16x16 hardcodeado
    const bitmap = [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
      0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
      1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,
      1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,
      1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,
      1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
      0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    ];

    const data = {

      mensaje: "PRUEBA DE FUNCIONAMIENTO",

      bitmap: bitmap,

      audio: 1,

      timestamp: Date.now(),
    };

    client.publish(
      "smartbox/eventos",
      JSON.stringify(data)
    );

    console.log("Mensaje enviado");

    console.log(data);

    alert("Mensaje de prueba enviado");
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Smart Notification Box</h1>

        <div className="estado">
          <div className="dot"></div>
          <span className="estado-texto">Conectado</span>
        </div>

        <div className="card">
          <label>Mensaje</label>
          <textarea
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
          <button onClick={enviarMensaje}>Enviar Mensaje</button>
        </div>

        <div className="card">
          <label>Audio</label>
          <select>
            <option value="1">Audio 1</option>
            <option value="2">Audio 2</option>
            <option value="3">Audio 3</option>
          </select>
          <button>Reproducir Audio</button>
        </div>

        <div className="card">
          <label>Imagen</label>
          <select>
            <option value="1">Imagen 1</option>
            <option value="2">Imagen 2</option>
            <option value="3">Imagen 3</option>
          </select>
          <button>Mostrar Imagen</button>
        </div>

        <div className="card">
          <button>Abrir Tapa</button>
        </div>
      </div>
    </div>
  );
}

export default App;
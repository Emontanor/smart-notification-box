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

  const enviarMensaje = () => {
    const data = {
      tipo: "mensaje",
      texto: mensaje,
      timestamp: Date.now(),
    };

    client.publish("smartbox/eventos", JSON.stringify(data));

    console.log("Mensaje enviado");

    console.log(data);

    alert("Mensaje enviado al broker MQTT");
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Smart Notification Box</h1>

        <p className="subtitle">MQTT Cloud Control</p>

        <div className="card">
          <label>Mensaje</label>

          <textarea
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </div>

        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
}

export default App;

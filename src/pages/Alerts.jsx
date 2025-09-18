import { useState } from "react";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    { type: "ALERT", message: "Heavy flooding in Riverside area – avoid travel." },
    { type: "INFO", message: "Relief camp set up at Central School, Sector 5." },
    { type: "ALERT", message: "Power outage expected in North Zone – keep essentials ready." },
    { type: "INFO", message: "Safe Shelters arranged 1km away from city." },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { sender: "Victim", time: "10:05 AM", message: "Medical help in block A." },
    { sender: "Volunteer", time: "10:07 AM", message: "Bringing supplies in 20 minutes." },
    { sender: "Authority", time: "10:10 AM", message: "Medical team dispatched." },
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.chatInput;
    const newMessage = input.value.trim();
    if (newMessage) {
      setChatMessages([...chatMessages, { sender: "You", time: new Date().toLocaleTimeString(), message: newMessage }]);
      input.value = "";
    }
  };

  const addAlert = () => {
    Swal.fire({
      title: 'Add New Alert',
      html:
        '<select id="swal-type" class="swal2-input">' +
        '<option value="ALERT">ALERT</option>' +
        '<option value="INFO">INFO</option>' +
        '</select>' +
        '<input id="swal-message" class="swal2-input" placeholder="Alert message">',
      focusConfirm: false,
      preConfirm: () => {
        const type = document.getElementById('swal-type').value;
        const message = document.getElementById('swal-message').value;
        if (!message) {
          Swal.showValidationMessage('Please enter an alert message');
          return;
        }
        return { type, message };
      }
    }).then(result => {
      if (result.isConfirmed) {
        setAlerts([...alerts, result.value]);
        Swal.fire({ icon: 'success', title: 'Alert added!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  return (
    <main className="page alerts-page">
      <h1>Alerts and Communication</h1>
      <p className="tagline">Stay updated with live alerts and coordinate with others.</p>

      {/* Emergency Alerts */}
      <section>
        <h2>Emergency Alerts</h2>
        <ul>
          {alerts.map((a, i) => (
            <li key={i}><strong>[{a.type}]</strong> {a.message}</li>
          ))}
        </ul>

        {/* Centered Add Alert Button */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={addAlert}>➕ Add Alert</button>
        </div>
      </section>

      {/* Live Chat */}
      <section>
        <h2>Live Chat</h2>
        <div 
          id="chat-box" 
          style={{ 
            maxHeight: "300px", 
            overflowY: "auto", 
            border: "1px solid #ccc", 
            padding: "10px", 
            marginBottom: "10px" 
          }}
        >
          {chatMessages.map((m, i) => {
            let bgColor = "#f0f0f0";
            if (m.sender === "Victim") bgColor = "#ffcccc";
            else if (m.sender === "Volunteer") bgColor = "#ccffcc";
            else if (m.sender === "Authority") bgColor = "#cce0ff";
            else if (m.sender === "You") bgColor = "#fff2cc";

            return (
              <div 
                key={i} 
                style={{ 
                  backgroundColor: bgColor, 
                  padding: "5px 10px", 
                  margin: "5px 0", 
                  borderRadius: "5px" 
                }}
              >
                <strong>{m.sender}</strong> ({m.time}): {m.message}
              </div>
            );
          })}
        </div>

        <form id="chat-form" onSubmit={handleChatSubmit}>
          <input id="chat-input" name="chatInput" type="text" placeholder="Type your message..." required />
          <button type="submit">Send</button>
        </form>
      </section>
    </main>
  );
}

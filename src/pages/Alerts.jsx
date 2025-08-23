export default function AlertsPage() {
  return (
    <main className="page alerts-page">
      <h1>Alerts and Communication</h1>
      <p className="tagline">Stay updated with live alerts and coordinate with others.</p>

      <section>
        <h2>Emergency Alerts</h2>
        <ul>
          <li><strong>[ALERT]</strong> Heavy flooding in Riverside area – avoid travel.</li>
          <li><strong>[INFO]</strong> Relief camp set up at Central School, Sector 5.</li>
          <li><strong>[ALERT]</strong> Power outage expected in North Zone – keep essentials ready.</li>
          <li><strong>[INFO]</strong> Safe Shelters arranged 1km away from city.</li>
        </ul>
      </section>

      <section>
        <h2>Live Chat</h2>
        <div id="chat-box">
          <div><strong>Victim</strong> (10:05 AM): Medical help in block A.</div>
          <div><strong>Volunteer</strong> (10:07 AM): Bringing supplies in 20 minutes.</div>
          <div><strong>Authority</strong> (10:10 AM): Medical team dispatched.</div>
        </div>

        <form id="chat-form">
          <input id="chat-input" type="text" placeholder="Type your message..." required />
          <button type="submit">Send</button>
        </form>
      </section>
    </main>
  );
}

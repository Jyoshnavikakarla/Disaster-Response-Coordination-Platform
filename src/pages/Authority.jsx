export default function AuthorityDashboard() {
  return (
    <main className="page dashboard-page">
      <h1>Authority Dashboard</h1>
      <p className="tagline">Monitor requests, volunteers, and available resources.</p>

      <section>
        <h2>Incoming Victim Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Emergency Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sample Victim</td>
              <td>Downtown</td>
              <td>+91 9876543210</td>
              <td>Injured people, need medical support</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Available Volunteers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Resources</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sample Volunteer</td>
              <td>+91 1234567890</td>
              <td>Food, Water</td>
              <td>Transport</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Available Resources</h2>
        <ul>
          <li>Clothing</li>
          <li>Food Supplies</li>
          <li>Water</li>
          <li>Medicine</li>
          <li>Safe Shelters</li>
          <li>Transport Vehicles</li>
        </ul>
      </section>
    </main>
  );
}

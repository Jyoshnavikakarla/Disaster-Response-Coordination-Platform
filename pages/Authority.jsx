import { useAppContext } from "../Context/AppContext";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function AuthorityDashboard() {
  const {
    victims,
    volunteers,
    addVictim,
    updateVictim,
    deleteVictim,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer
  } = useAppContext();

  const resources = [
    "Clothing", "Food Supplies", "Water", "Medicine", "Safe Shelters", "Transport Vehicles"
  ];

  // ----------------- Victims CRUD -----------------
  const handleAddVictim = () => {
    Swal.fire({
      title: 'Add New Victim',
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Name">' +
        '<input id="swal-location" class="swal2-input" placeholder="Location">' +
        '<input id="swal-contact" class="swal2-input" placeholder="Contact">' +
        '<input id="swal-details" class="swal2-input" placeholder="Emergency Details">',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const location = document.getElementById('swal-location').value;
        const contact = document.getElementById('swal-contact').value;
        const details = document.getElementById('swal-details').value;
        if (!name || !location || !contact || !details) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }
        return { name, location, contact, details };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addVictim(result.value);
        Swal.fire({ icon: 'success', title: 'Victim added!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  const handleUpdateVictim = (id) => {
    const victim = victims.find(v => v.id === id);
    Swal.fire({
      title: 'Update Victim Details',
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Name" value="${victim.name}">` +
        `<input id="swal-location" class="swal2-input" placeholder="Location" value="${victim.location}">` +
        `<input id="swal-contact" class="swal2-input" placeholder="Contact" value="${victim.contact}">` +
        `<input id="swal-details" class="swal2-input" placeholder="Details" value="${victim.details}">`,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const location = document.getElementById('swal-location').value;
        const contact = document.getElementById('swal-contact').value;
        const details = document.getElementById('swal-details').value;
        if (!name || !location || !contact || !details) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }
        return { name, location, contact, details };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVictim(id, result.value);
        Swal.fire({ icon: 'success', title: 'Victim updated!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  const handleDeleteVictim = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteVictim(id);
        Swal.fire({ icon: 'success', title: 'Victim deleted!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  // ----------------- Volunteers CRUD -----------------
  const handleAddVolunteer = () => {
    Swal.fire({
      title: 'Add New Volunteer',
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Name">' +
        '<input id="swal-contact" class="swal2-input" placeholder="Contact">' +
        '<input id="swal-resources" class="swal2-input" placeholder="Resources (comma separated)">' +
        '<input id="swal-skills" class="swal2-input" placeholder="Skills">',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const contact = document.getElementById('swal-contact').value;
        const resources = document.getElementById('swal-resources').value;
        const skills = document.getElementById('swal-skills').value;
        if (!name || !contact || !resources || !skills) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }
        return { name, contact, resources, skills };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addVolunteer(result.value);
        Swal.fire({ icon: 'success', title: 'Volunteer added!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  const handleUpdateVolunteer = (id) => {
    const vol = volunteers.find(v => v.id === id);
    Swal.fire({
      title: 'Update Volunteer Details',
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Name" value="${vol.name}">` +
        `<input id="swal-contact" class="swal2-input" placeholder="Contact" value="${vol.contact}">` +
        `<input id="swal-resources" class="swal2-input" placeholder="Resources" value="${vol.resources}">` +
        `<input id="swal-skills" class="swal2-input" placeholder="Skills" value="${vol.skills}">`,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const contact = document.getElementById('swal-contact').value;
        const resources = document.getElementById('swal-resources').value;
        const skills = document.getElementById('swal-skills').value;
        if (!name || !contact || !resources || !skills) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }
        return { name, contact, resources, skills };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVolunteer(id, result.value);
        Swal.fire({ icon: 'success', title: 'Volunteer updated!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  const handleDeleteVolunteer = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteVolunteer(id);
        Swal.fire({ icon: 'success', title: 'Volunteer deleted!', showConfirmButton: false, timer: 1500 });
      }
    });
  };

  return (
    <main className="page dashboard-page">
      <h1>Authority Dashboard</h1>

      {/* Victims */}
      <section>
        <h2>Incoming Victim Requests</h2>
        <button onClick={handleAddVictim}>➕ Add Victim</button>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Location</th><th>Contact</th><th>Details</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {victims.map(v => (
              <tr key={v.id}>
                <td>{v.name}</td><td>{v.location}</td><td>{v.contact}</td><td>{v.details}</td>
                <td>
                  <button onClick={() => handleUpdateVictim(v.id)}>✏️ Update</button>
                  <button onClick={() => handleDeleteVictim(v.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {victims.length === 0 && <tr><td colSpan="5">No victim requests.</td></tr>}
          </tbody>
        </table>
      </section>

      {/* Volunteers */}
      <section>
        <h2>Available Volunteers</h2>
        <button onClick={handleAddVolunteer}>➕ Add Volunteer</button>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Contact</th><th>Resources</th><th>Skills</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map(v => (
              <tr key={v.id}>
                <td>{v.name}</td><td>{v.contact}</td><td>{v.resources}</td><td>{v.skills}</td>
                <td>
                  <button onClick={() => handleUpdateVolunteer(v.id)}>✏️ Update</button>
                  <button onClick={() => handleDeleteVolunteer(v.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {volunteers.length === 0 && <tr><td colSpan="5">No volunteers yet.</td></tr>}
          </tbody>
        </table>
      </section>

      {/* Resources */}
      <section>
        <h2>Available Resources</h2>
        <ul>{resources.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </section>
    </main>
  );
}

import { useAppContext } from "../AppContext";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Request() {
  const { victims, setVictims } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const newVictim = {
      id: Date.now(),
      name: form.name.value,
      location: form.location.value,
      contact: form.contact.value,
      details: form.details.value
    };

    setVictims([...victims, newVictim]);

    Swal.fire({
      icon: 'success',
      title: '✅ Request submitted successfully!',
      showConfirmButton: false,
      timer: 1500
    });

    form.reset();
  };

  return (
    <main className="page">
      <h1>Help Request Form</h1>
      <p className="tagline">Submit your request for assistance. Authorities and volunteers will be notified.</p>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" name="name" placeholder="Enter your name" required />

        <label>Location:</label>
        <input type="text" name="location" placeholder="Enter your location" required />

        <label>Contact Number:</label>
        <input type="tel" name="contact" placeholder="Enter your phone number" required />

        <label>Details of Emergency:</label>
        <textarea name="details" placeholder="Describe the emergency..." required></textarea>

        <button type="submit">Submit Request</button>
      </form>
    </main>
  );
}

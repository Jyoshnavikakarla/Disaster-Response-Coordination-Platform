import { useAppContext } from "../AppContext";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Request() {
  const { victims, setVictims, loggedInUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!loggedInUser) {
      Swal.fire({
        icon: 'error',
        title: '❌ Please login first!',
      });
      return;
    }

    const token = localStorage.getItem("token"); // ✅ get JWT token

    const newRequest = {
      name: form.name.value,
      location: form.location.value,
      contact: form.contact.value,
      details: form.details.value,
      role: loggedInUser.role,   // victim or volunteer
      userId: loggedInUser.id
    };

    try {
      const res = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ send token
        },
        body: JSON.stringify(newRequest)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const result = await res.json();
      console.log("Saved in backend:", result);

      // Update local state
      setVictims([...victims, { ...newRequest, id: result._id }]);

      Swal.fire({
        icon: 'success',
        title: '✅ Request submitted successfully!',
        showConfirmButton: false,
        timer: 1500
      });

      form.reset();
    } catch (err) {
      console.error("Submission failed:", err);
      Swal.fire({
        icon: 'error',
        title: '❌ Submission failed!',
        text: err.message || 'Please try again.',
      });
    }
  };

  return (
    <main className="page">
      <h1>Help Request Form</h1>
      <p className="tagline">
        Submit your request for assistance. Authorities and volunteers will be notified.
      </p>

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

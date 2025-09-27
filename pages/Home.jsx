
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>
            Disaster Response <br /> Coordination Platform
          </h1>
          <p className="tagline">
            Together, we can save lives and rebuild hope.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

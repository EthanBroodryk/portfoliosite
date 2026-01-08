import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/landing_page/nav";
import ContactForm from '@/components/landing_page/contact-form';

export default function Welcome() {
  const [showForm, setShowForm] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
      setShowForm(true);
    }
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      <Nav />

      {/* Hero */}
      <motion.section
        className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.7 } }}
        >
          Custom Software Solutions for Real Business Problems
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7 } }}
        >
          We build scalable, modern web and mobile applications tailored to your exact needs.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.7 } }}
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            Get a Quote
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-100"
          >
            View Work
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Services */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Custom Software Development", desc: "Tailored systems built to automate, streamline, and scale your business." },
            { title: "Web & Mobile Apps", desc: "Beautiful, fast, secure applications for Android, iOS, and the web." },
            { title: "API & Systems Integration", desc: "Unify your business tools and data into a single, powerful ecosystem." }
          ].map((s, i) => (
            <motion.div
              key={s.title}
              className="p-8 bg-white shadow rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {["Discovery", "Design", "Development", "Testing", "Deployment", "Support"].map((step, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                {i + 1}
              </div>
              <p className="font-semibold">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={contactRef} className="py-24 text-center bg-blue-600 text-white">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Let's Build Something Great
        </motion.h2>

        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow hover:bg-gray-200"
        >
          Contact Us
        </motion.button>

        {/* Contact form */}
        <ContactForm show={showForm} />
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Zenchi Technologies. All rights reserved.
      </footer>
    </div>
  );
}

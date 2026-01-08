import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/landing_page/nav";
import ContactForm from '@/components/landing_page/contact-form';
import TypingText from "@/components/ui/TypingText";


export default function Welcome() {
  const [showForm, setShowForm] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
      setShowForm(true);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 text-gray-900 relative overflow-hidden">
      <Nav />

      {/* Hero */}
      <motion.section
        className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 opacity-30 blur-3xl animate-hero-gradient"
            animate={{ rotate: [0, 360, 0] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Animated hero blobs */}
        <motion.div
          className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px] bg-purple-500 rounded-full opacity-40 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: [0, 360, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[-60px] right-[-60px] w-[200px] h-[200px] bg-pink-400 rounded-full opacity-30 blur-3xl"
          animate={{ x: [0, -120, 0], y: [0, -60, 0], rotate: [0, -360, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        />
        <motion.div
          className="absolute top-[30%] left-[50%] w-[100px] h-[100px] bg-yellow-400 rounded-full opacity-20 blur-2xl"
          animate={{ x: [-50, 50, -50], y: [-20, 20, -20], rotate: [0, 180, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        />

        {/* Hero headline with TypingText */}
        <TypingText
          text={[
            "Custom Software Solutions for Real Business Problems",
            "Modern Web & Mobile Applications Built for You",
            "Scale Your Business with Smart Software"
          ]}
          typingSpeed={75}
          pauseDuration={2000}
          showCursor={true}
          className="text-4xl md:text-6xl font-bold text-center relative z-10 max-w-4xl"
          cursorClassName="h-12"
          textColors={['#3b82f6', '#8b5cf6', '#06b6d4']}
          variableSpeed={{ min: 50, max: 120 }}
        />

        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl mt-6 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.7 } }}
        >
          We build scalable, modern web and mobile applications tailored to your exact needs.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.7 } }}
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

      {/* CTA with animated background */}
      <section ref={contactRef} className="relative py-24 text-center bg-blue-600 text-white overflow-hidden">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-0 left-0 w-[300px] h-[300px] bg-pink-500 rounded-full opacity-30"
          animate={{ x: [0, 200, 0], y: [0, 100, 0] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400 rounded-full opacity-30"
          animate={{ x: [0, -150, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "loop" }}
        />

        <motion.h2
          className="text-4xl font-bold mb-6 relative z-10"
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
          className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow hover:bg-gray-200 relative z-10"
        >
          Contact Us
        </motion.button>

        {/* Contact form */}
        <div className="relative z-10 mt-8">
          <ContactForm show={showForm} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Zenchi Technologies. All rights reserved.
      </footer>
    </div>
  );
}

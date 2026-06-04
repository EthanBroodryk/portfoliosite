import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/landing_page/nav";
import ContactForm from "@/components/landing_page/contact-form";
import TypingText from "@/components/ui/TypingText";
import Logo2 from "@/components/landing_page/logo2";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Welcome() {
  const [showForm, setShowForm] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null); // ref for carousel section

  // Carousel images
  const carouselImages = [
    "/carousel/Screenshot from 2026-03-05 15-18-13.png",
    "/carousel/Screenshot from 2026-03-05 15-20-35.png",
    "/carousel/Screenshot from 2026-03-05 15-31-16.png",
    "/carousel/Screenshot from 2026-03-05 15-34-39.png",
    "/carousel/Screenshot from 2026-03-05 15-38-27.png",
    "/carousel/Screenshot from 2026-03-05 15-40-37.png",
    "/carousel/Screenshot from 2026-03-05 15-43-39.png",
    "/carousel/Screenshot from 2026-03-05 15-42-28.png",
    "/carousel/Screenshot from 2026-03-05 15-47-07.png",
    "/carousel/Screenshot from 2026-03-05 15-50-27.png",
    "/carousel/Screenshot from 2026-03-09 11-06-36.png",
  ];

 

  const sliderName = [
    "Custom Dashboard",
    "Product Management",
    "Manage Stock Movements",
    "Receiving",
    "Mobile and Desktop Barcode Scanning",
    "Mobile and Desktop POS",
    "Sales With Mobile",
    "Scan Barcode with Mobile or Desktop",
    "Drag and drop Report Builder",
    "Supplier Management",
    "Quote Generation",
  ];

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
      setShowForm(true);
    }
  };

  const scrollToFeatures = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 text-gray-900 relative overflow-hidden">
      <Nav featuresRef={carouselRef} />

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

        {/* Hero headline */}
        <TypingText
          text={[
            "Custom Software Solutions for Real Business Problems",
            "Modern Web & Mobile Applications Built for You",
            "Scale Your Business with Smart Software",
          ]}
          typingSpeed={75}
          pauseDuration={2000}
          showCursor={true}
          className="text-4xl md:text-6xl font-bold text-center relative z-10 max-w-4xl"
          cursorClassName="h-12"
          textColors={["#3b82f6", "#2cd134", "#06b6d4"]}
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
            onClick={() =>
              window.open("https://www.youtube.com/watch?v=ozaoeAqROU8", "_blank")
            }
          >
            View Work
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Logo */}
      <section className="flex justify-center items-center py-16">
        <Logo2 />
      </section>


      {/* carousel label */}
      <motion.h2
        style={{
          fontSize: "72px",
          background: "linear-gradient(to top, #d5d7dd02, #e3e7ec00)",
          padding: "20px 0", 
        }}
        className="text-center"
        // Parent animation controls
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2, // Wait 0.2s before starting the first letter
              staggerChildren: 0.08 // Time gap between each letter appearing (lower = faster)
            }
          }
        }}
      >
        <span
          style={{
            background: "linear-gradient(45deg, #4ade80, #06b6d4)", 
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block" // Crucial for text gradient and transform clipping
          }}
        >
          {"Products".split("").map((letter, index) => (
            <motion.span
              key={index}
              style={{ display: "inline-block" }} // Allows letter to move up and down independently
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { type: "spring", damping: 12, stiffness: 100 } // Gives a slight subtle bounce
                }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </motion.h2>
      {/* Carousel Section */}
      <section ref={carouselRef} className="py-20 flex flex-col items-center gap-6">
        <Carousel className="w-full max-w-3xl">
          <CarouselContent>
            {carouselImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center p-2 gap-2">
                  <h3 className="text-lg font-semibold text-center">{sliderName[index]}</h3>
                  <Card>
                    <CardContent className="flex items-center justify-center p-2">
                      <img
                        src={src}
                        alt={sliderName[index]}
                        className="rounded-xl w-full object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Services */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Custom Software Development", desc: "Tailored systems built to automate, streamline, and scale your business." },
            { title: "Web & Mobile Apps", desc: "Beautiful, fast, secure applications for Android, iOS, and the web." },
            { title: "API & Systems Integration", desc: "Unify your business tools and data into a single ecosystem." },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              className="p-8 bg-white shadow rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={contactRef} className="relative py-24 text-center bg-blue-600 text-white overflow-hidden">
        <motion.h2 className="text-4xl font-bold mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          Let's Build Something Great
        </motion.h2>

        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow hover:bg-gray-200"
        >
          Contact
        </motion.button>

        <div className="mt-8">
          <ContactForm show={showForm} onClose={() => setShowForm(false)} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Zenchi Technologies. All rights reserved.
      </footer>
    </div>
  );
}


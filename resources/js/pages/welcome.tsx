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

  // Carousel images for Inventory management system
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


  //Carousel Job-Card-Images
  const jobCardImages = [
    
    "/jobcardcarousel/Dashboard.png",
    "/jobcardcarousel/DashboardMobile.png",
    "/jobcardcarousel/MyJobs.png",
    "/jobcardcarousel/StartJobMibile.png",
    "/jobcardcarousel/GettingLocation.png",
    "/jobcardcarousel/BeforePhotos.png",
    "/jobcardcarousel/ContinueToJobCard.png",
    "/jobcardcarousel/JobCardFilledIn.png",
    "/jobcardcarousel/AfterPhotos.png",
    "/jobcardcarousel/ContinueToSignature.png",
    "/jobcardcarousel/MarkJobAsCompleted.png",
    "/jobcardcarousel/AllJobs.png",
    "/jobcardcarousel/JobCardAdminView.png",
    "/jobcardcarousel/Location.png",
    "/jobcardcarousel/printjobcard.png",
    "/jobcardcarousel/UserManagement.png",
    "/jobcardcarousel/InvoiceCreator.png",
    "/jobcardcarousel/2fa.png",

  ];

  // Carousel labels for Job Card system
  const jobCardSliderNames = [
    "Dashboard Overview",
    "Mobile Dashboard View",
    "My Allocated Jobs",
    "Start Job on Mobile",
    "Fetching Geolocation",
    "Before Action Photos",
    "Continue to Job Card",
    "Completed Job Card",
    "After Action Photos",
    "Continue to Client Signature",
    "Mark Job as Completed",
    "All System Jobs",
    "Administrator View",
    "Location Tracking Mapping",
    "Printable Job Card View",
    "User Management System",
    "Invoice Creator Tool",
    "2-Factor Authentication Secure Access",
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
      <motion.h2 ref={carouselRef}
        style={{
          fontSize: "72px",
          background: "linear-gradient(to top, #d5d7dd02, #e3e7ec00)",
          padding: "10px 0", 
        }}
        className="text-center"
        // Parent animation controls
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }} // Fixed: once is false, resets when 30% out of view
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.08 
            }
          }
        }}
      >
        <span
          style={{
            background: "linear-gradient(45deg, #4ade56, #198497)", 
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block"
          }}
        >
          {"Products".split("").map((letter, index) => (
            <motion.span
              key={index}
              style={{ display: "inline-block" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { type: "spring", damping: 12, stiffness: 100 }
                }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </motion.h2>
      {/* Carousel Section */}
      <section  className="py-10 flex flex-col items-center gap-12 w-full px-6 max-w-4xl mx-auto">
        
        {/* --- Carousel 1: Inventory System --- */}
        <div className="w-full flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 w-full text-center">
            Inventory Management System
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center p-2 gap-2">
                    <h3 className="text-lg font-semibold text-center text-gray-600">{sliderName[index]}</h3>
                    <Card className="w-full shadow-md">
                      <CardContent className="flex items-center justify-center p-2">
                        <img
                          src={src}
                          alt={sliderName[index]}
                          className="rounded-xl w-full max-h-[450px] object-contain bg-black/5"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* --- Carousel 2: Job Card System --- */}
        <div className="w-full flex flex-col items-center gap-4 mt-8">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 w-full text-center">
            Job Card Tracking System
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {jobCardImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center p-2 gap-2">
                    <h3 className="text-lg font-semibold text-center text-gray-600">{jobCardSliderNames[index]}</h3>
                    <Card className="w-full shadow-md">
                      <CardContent className="flex items-center justify-center p-2">
                        <img
                          src={src}
                          alt={jobCardSliderNames[index]}
                          className="rounded-xl w-full max-h-[450px] object-contain bg-black/5"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

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


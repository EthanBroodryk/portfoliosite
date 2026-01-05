import { useState } from "react";
import Nav from "@/components/landing_page/nav";
import ContactForm from "@/components/landing_page/contact-form";

export default function Welcome() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-900">
      <Nav />

      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Custom Software Solutions for Real Business Problems
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          We build scalable, modern web and mobile applications tailored to your exact needs.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
            Get a Quote
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-100">
            View Work
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-6">Let's Build Something Great</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow hover:bg-gray-200"
        >
          Contact Us
        </button>

        {/* Sliding Contact Form */}
        <ContactForm show={showForm} />
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

interface ContactFormProps {
  show: boolean;
}

export default function ContactForm({ show }: ContactFormProps) {
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    name: "",
    email: "",
    message: "",
    website: "",
    general: "", // add general error
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    // Honeypot check
    if (form.data.website) {
      form.setError("general", "Spam detected.");
      return;
    }

    form.post("/contact", {
      onSuccess: () => {
        setSuccess("Message sent successfully!");
        form.reset(); // resets all fields
      },
    });
  };

  return (
    <div
      className={`
        overflow-hidden transition-all duration-700 
        bg-white shadow-xl max-w-xl mx-auto mt-4 rounded-2xl
        ${show ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            className="hidden"
            autoComplete="off"
            value={form.data.website}
            onChange={(e) => form.setData("website", e.target.value)}
          />

          <div>
            <label className="block mb-1 font-semibold text-gray-800">Name</label>
            <input
              type="text"
              name="name"
              value={form.data.name}
              onChange={(e) => form.setData("name", e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
            {form.errors.name && <p className="text-red-600 mt-1">{form.errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              value={form.data.email}
              onChange={(e) => form.setData("email", e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
            {form.errors.email && <p className="text-red-600 mt-1">{form.errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-800">Message</label>
            <textarea
              name="message"
              value={form.data.message}
              onChange={(e) => form.setData("message", e.target.value)}
              className="w-full border rounded-lg p-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
            {form.errors.message && <p className="text-red-600 mt-1">{form.errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={form.processing}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
              form.processing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {form.processing ? "Sending..." : "Send Message"}
          </button>

          {success && <p className="text-green-600 mt-2">{success}</p>}
          {form.errors.general && <p className="text-red-600 mt-2">{form.errors.general}</p>}
        </form>
      </div>
    </div>
  );
}

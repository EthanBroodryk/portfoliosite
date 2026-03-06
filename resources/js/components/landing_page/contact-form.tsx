import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

interface ContactFormProps {
  show: boolean;
  onClose: () => void;
}

export default function ContactForm({ show, onClose }: ContactFormProps) {
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    name: "",
    email: "",
    message: "",
    website: "",
    general: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (form.data.website) {
      form.setError("general", "Spam detected.");
      return;
    }

    form.post("/contact", {
      onSuccess: () => {
        setSuccess("Message sent successfully!");
        form.reset();
        setTimeout(() => onClose(), 1000);
      },
    });
  };

  return (
    <div
      className={`
        overflow-hidden transition-all duration-700 
        bg-white max-w-xl mx-auto mt-6
        ${show ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className="p-8">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
          Contact Us
        </h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            className="hidden"
            autoComplete="off"
            value={form.data.website}
            onChange={(e) => form.setData("website", e.target.value)}
          />

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={form.data.name}
              onChange={(e) => form.setData("name", e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              required
            />
            {form.errors.name && (
              <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={form.data.email}
              onChange={(e) => form.setData("email", e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              required
            />
            {form.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Message</label>
            <textarea
              value={form.data.message}
              onChange={(e) => form.setData("message", e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 h-28 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
              required
            />
            {form.errors.message && (
              <p className="text-red-500 text-sm mt-1">{form.errors.message}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={form.processing}
            className={`w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              form.processing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {form.processing ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-green-600 text-center text-sm mt-3">{success}</p>
          )}
          {form.errors.general && (
            <p className="text-red-500 text-center text-sm mt-3">
              {form.errors.general}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
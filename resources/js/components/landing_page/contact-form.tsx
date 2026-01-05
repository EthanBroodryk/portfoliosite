import React from "react";

export default function ContactForm({ show }: { show: boolean }) {
  return (
    <div
      className={`
        overflow-hidden transition-all duration-700 
        bg-white shadow-xl max-w-xl mx-auto mt-4 rounded-2xl
        ${show ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Contact Us</h3>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input type="text" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input type="email" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Message</label>
            <textarea className="w-full border rounded-lg p-2 h-32"></textarea>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

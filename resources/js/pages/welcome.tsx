import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Nav from "@/components/nav";


export default function Welcome() {
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

      {/* Services */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Custom Software Development",
              desc: "Tailored systems built to automate, streamline, and scale your business."
            },
            {
              title: "Web & Mobile Apps",
              desc: "Beautiful, fast, secure applications for Android, iOS, and the web."
            },
            {
              title: "API & Systems Integration",
              desc: "Unify your business tools and data into a single, powerful ecosystem."
            }
          ].map((s) => (
            <div key={s.title} className="p-8 bg-white shadow rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {["Discovery", "Design", "Development", "Testing", "Deployment", "Support"].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                {i + 1}
              </div>
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-6">Let's Build Something Great</h2>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow hover:bg-gray-200">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </div>
  );
}

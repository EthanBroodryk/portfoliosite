import { useState } from "react";
import { Link } from "@inertiajs/react";
import { dashboard, login, register } from "@/routes";
import Logo from "./logo";

interface NavProps {
  featuresRef: React.RefObject<HTMLElement>;
}

export default function Nav({ featuresRef }: NavProps) {
  const [open, setOpen] = useState<boolean>(false);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <>
      <nav className="w-full bg-white shadow fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <button onClick={scrollToFeatures} className="hover:text-blue-600">Features</button>
            <Link href={dashboard()} className="hover:text-blue-600">Dashboard</Link>
            <Link href={login()} className="hover:text-blue-600">Login</Link>
            <Link href={register()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden focus:outline-none" onClick={() => setOpen(true)} aria-label="Open menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform z-50 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center border-b">
          <Logo />
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-6 flex flex-col gap-4 text-lg">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <button onClick={scrollToFeatures} className="hover:text-blue-600 text-left">Features</button>
          <Link href={dashboard()} className="hover:text-blue-600">Dashboard</Link>
          <Link href={login()} className="hover:text-blue-600">Login</Link>
          <Link href={register()} className="hover:text-blue-600">Register</Link>
        </nav>
      </aside>
    </>
  );
}
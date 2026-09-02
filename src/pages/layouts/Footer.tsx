import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const Footer = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // تنسيق الوقت بصيغة UTC / Local معماري قياسي
  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });


  return (
    <footer className="border-t border-[#14213D] bg-[#14213D] text-[#F7F5EF] antialiased">
      <FontImports />

      {/* Upper Footer Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Brand Info Column */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              className={`${serif} text-2xl font-bold tracking-tight text-[#FFFDF9] hover:text-[#B8863B] transition-colors`}
            >
              ESTATE.
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#EFEAE0]">
              An intentional real estate platform simplifying property discovery, rentals, and portfolio management across Egypt.
            </p>

            {/* Live Clock Badge */}
            <div className={`${mono} mt-6 flex items-center gap-3 text-xs uppercase tracking-widest text-[#B8863B]`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B8863B] opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-[#B8863B]" />
              </span>
              <span>
                SYSTEM TIME: <span className="text-[#FFFDF9]">{formattedTime}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className={`${mono} text-xs font-semibold uppercase tracking-widest text-[#B8863B]`}>
              Navigation
            </h4>
            <ul className={`${mono} mt-6 space-y-3 text-xs tracking-wider uppercase text-[#EFEAE0]`}>
              <li>
                <Link to="/" className="transition hover:text-[#B8863B]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="transition hover:text-[#B8863B]">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-[#B8863B]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-[#B8863B]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Operational Details */}
          <div className="lg:col-span-4">
            <h4 className={`${mono} text-xs font-semibold uppercase tracking-widest text-[#B8863B]`}>
              Headquarters
            </h4>
            <div className={`${mono} mt-6 space-y-2 text-xs leading-relaxed text-[#EFEAE0]`}>
              <p>Tanta, El-Gharbiya, Egypt</p>
              <p className="text-[#B8863B] font-semibold">
                {currentDateTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p>Mon — Fri / 09:00 — 18:00 EEST</p>
              <p className="pt-2 text-[#B8863B]">support@estate.com</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#14213D]/60 bg-[#0D1629] px-6 py-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className={`${mono} text-[11px] uppercase tracking-wider text-[#EFEAE0]/70`}>
            © {currentDateTime.getFullYear()} ESTATE. All rights reserved.
          </p>

          <div className={`${mono} flex items-center gap-4 text-[11px] uppercase tracking-wider text-[#EFEAE0]/50`}>
            <span>EEST (UTC+3)</span>
            <span>•</span>
            <span>Built with React & NestJS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

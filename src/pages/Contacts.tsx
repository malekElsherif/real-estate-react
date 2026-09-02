import React from "react";
import { Link } from "react-router-dom";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const Contacts = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#14213D] antialiased">
      <FontImports />

      {/* Hero Section */}
      <section className="relative border-b border-[#14213D] bg-[#14213D] px-6 py-20 text-[#F7F5EF] lg:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <span
            className={`${mono} inline-flex items-center gap-2 border border-[#B8863B]/40 bg-[#14213D] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B8863B]`}
          >
            <span className="h-1.5 w-1.5 bg-[#B8863B]" />
            Get In Touch
          </span>

          <h1
            className={`${serif} mt-6 text-4xl font-semibold leading-tight text-[#F7F5EF] sm:text-5xl`}
          >
            We’d Love to Hear <span className="italic text-[#B8863B]">From You</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#EFEAE0] sm:text-base">
            Have a question about a listed property, require administrative support, or wish to partner with us? Reach out and our team will assist promptly.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-3">

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <div>
              <span className={`${mono} text-xs font-medium uppercase tracking-[0.25em] text-[#B8863B]`}>
                Direct Communication
              </span>

              <h2 className={`${serif} mt-2 text-3xl font-semibold text-[#14213D]`}>
                Contact Info
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#4A5568]">
                Our support desk is available to resolve technical inquiries and guide property operations.
              </p>
            </div>

            {/* Info Cards */}
            <div className="relative border border-[#14213D] bg-[#FFFDF9] p-6">
              <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
              <div className="flex items-start gap-4">
                <div className={`${mono} flex h-10 w-10 shrink-0 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-xs font-semibold text-[#14213D]`}>
                  LOC
                </div>
                <div>
                  <h3 className={`${serif} font-semibold text-[#14213D]`}>Headquarters</h3>
                  <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
                    Tanta, El-Gharbiya, Egypt
                  </p>
                </div>
              </div>
            </div>

            <div className="relative border border-[#14213D] bg-[#FFFDF9] p-6">
              <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
              <div className="flex items-start gap-4">
                <div className={`${mono} flex h-10 w-10 shrink-0 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-xs font-semibold text-[#14213D]`}>
                  TEL
                </div>
                <div>
                  <h3 className={`${serif} font-semibold text-[#14213D]`}>Phone Support</h3>
                  <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
                    +20 100 000 0000
                  </p>
                </div>
              </div>
            </div>

            <div className="relative border border-[#14213D] bg-[#FFFDF9] p-6">
              <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
              <div className="flex items-start gap-4">
                <div className={`${mono} flex h-10 w-10 shrink-0 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-xs font-semibold text-[#14213D]`}>
                  MSG
                </div>
                <div>
                  <h3 className={`${serif} font-semibold text-[#14213D]`}>Email Address</h3>
                  <p className={`${mono} mt-1 text-xs text-[#4A5568]`}>
                    support@estate.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-2">
            <div className="relative border border-[#14213D] bg-[#FFFDF9] p-8 md:p-10">
              <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#14213D]" />
              <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-[#14213D]" />

              <h2 className={`${serif} text-2xl font-semibold text-[#14213D] md:text-3xl`}>
                Send Us a Message
              </h2>

              <p className={`${mono} mt-2 text-xs uppercase tracking-wider text-[#4A5568]`}>
                Complete the fields below to dispatch your message directly to our admins.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#14213D]`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#B8863B] focus:ring-1 focus:ring-[#B8863B]"
                    />
                  </div>

                  <div>
                    <label className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#14213D]`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@domain.com"
                      className="w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#B8863B] focus:ring-1 focus:ring-[#B8863B]"
                    />
                  </div>
                </div>

                <div>
                  <label className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#14213D]`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Inquiry topic..."
                    className="w-full border border-[#14213D] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#B8863B] focus:ring-1 focus:ring-[#B8863B]"
                  />
                </div>

                <div>
                  <label className={`${mono} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#14213D]`}>
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your detailed inquiry..."
                    className="w-full resize-none border border-[#14213D] bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#B8863B] focus:ring-1 focus:ring-[#B8863B]"
                  />
                </div>

                <button
                  type="submit"
                  className={`${mono} w-full border border-[#14213D] bg-[#14213D] py-4 text-xs font-semibold uppercase tracking-widest text-[#FFFDF9] transition hover:bg-[#B8863B] hover:border-[#B8863B] hover:text-[#FFFDF9]`}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-[#14213D] bg-[#FFFDF9] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className={`${serif} text-3xl font-semibold text-[#14213D]`}>
            Looking for a Property?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4A5568]">
            Explore our curated residential listings and submit lease or purchase requests directly.
          </p>

          <Link
            to="/properties"
            className={`${mono} mt-6 inline-block border border-[#14213D] bg-[#14213D] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] transition hover:bg-[#B8863B] hover:border-[#B8863B]`}
          >
            Browse Properties
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contacts;

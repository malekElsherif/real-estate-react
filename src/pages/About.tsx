import { Link } from "react-router-dom";

const FontImports = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
);

const serif = "[font-family:'Fraunces',serif]";
const mono = "[font-family:'IBM_Plex_Mono',monospace]";

const About = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#14213D] antialiased">
      <FontImports />

      {/* Hero Section */}
      <section className="relative border-b border-[#14213D] bg-[#14213D] px-6 py-20 text-[#F7F5EF] lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <span
            className={`${mono} inline-flex items-center gap-2 border border-[#B8863B]/40 bg-[#14213D] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B8863B]`}
          >
            <span className="h-1.5 w-1.5 bg-[#B8863B]" />
            About Estate
          </span>

          <h1
            className={`${serif} mt-6 text-4xl font-semibold leading-tight text-[#F7F5EF] sm:text-6xl`}
          >
            Find a place you'll <br />
            <span className="italic text-[#B8863B]">love to call home.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#EFEAE0] sm:text-base">
            We simplify finding, buying, and renting premium properties by
            connecting discerning clients with curated listings and trusted management.
          </p>
        </div>
      </section>

      {/* Who We Are & Stats Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className={`${mono} text-xs font-medium uppercase tracking-[0.25em] text-[#B8863B]`}>
              Who We Are
            </span>

            <h2 className={`${serif} mt-2 text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              Architectural Clarity & Modern Living
            </h2>

            <p className="mt-6 text-sm leading-relaxed text-[#4A5568] sm:text-base">
              Our platform provides an intentional, refined way to discover
              properties that match your lifestyle. Whether you're purchasing a permanent residence,
              securing a luxury rental, or managing high-end assets, we unify every step of the workflow.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#4A5568] sm:text-base">
              From detailed spec sheets and verified imagery to direct agent communication and streamlined request tracking, we prioritize transparency and elegance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="border border-[#14213D] bg-[#FFFDF9] p-8">
            <div className="grid grid-cols-2 gap-6 divide-y-0">
              <div className="border border-[#E4DFD3] p-6 text-center">
                <h3 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
                  100+
                </h3>
                <p className={`${mono} mt-2 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
                  Curated Properties
                </p>
              </div>

              <div className="border border-[#E4DFD3] p-6 text-center">
                <h3 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
                  50+
                </h3>
                <p className={`${mono} mt-2 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
                  Verified Agents
                </p>
              </div>

              <div className="border border-[#E4DFD3] p-6 text-center">
                <h3 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
                  500+
                </h3>
                <p className={`${mono} mt-2 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
                  Satisfied Clients
                </p>
              </div>

              <div className="border border-[#E4DFD3] p-6 text-center">
                <h3 className={`${serif} text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
                  24/7
                </h3>
                <p className={`${mono} mt-2 text-[11px] uppercase tracking-widest text-[#4A5568]`}>
                  Dedicated Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-[#14213D] bg-[#FFFDF9] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className={`${mono} text-xs font-medium uppercase tracking-[0.25em] text-[#B8863B]`}>
              Why Choose Us
            </span>

            <h2 className={`${serif} mt-2 text-3xl font-semibold text-[#14213D] sm:text-4xl`}>
              Designed for Seamless Property Discovery
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative flex flex-col border border-[#14213D] bg-[#FFFDF9] p-8">
              <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
              <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

              <div className={`${mono} mb-6 flex h-10 w-10 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-sm font-semibold text-[#14213D]`}>
                01
              </div>

              <h3 className={`${serif} text-xl font-semibold text-[#14213D]`}>
                Intuitive Filtering
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#4A5568]">
                Search listings by status, type, location, and parameters to quickly locate properties matching your specs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative flex flex-col border border-[#14213D] bg-[#FFFDF9] p-8">
              <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
              <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

              <div className={`${mono} mb-6 flex h-10 w-10 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-sm font-semibold text-[#14213D]`}>
                02
              </div>

              <h3 className={`${serif} text-xl font-semibold text-[#14213D]`}>
                Verified Property Portfolio
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#4A5568]">
                Explore residential and commercial spaces backdropped by verified ownership records and precise imagery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative flex flex-col border border-[#14213D] bg-[#FFFDF9] p-8">
              <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#14213D]" />
              <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-[1.5px] border-t-[1.5px] border-[#14213D]" />

              <div className={`${mono} mb-6 flex h-10 w-10 items-center justify-center border border-[#14213D] bg-[#EFEAE0] text-sm font-semibold text-[#14213D]`}>
                03
              </div>

              <h3 className={`${serif} text-xl font-semibold text-[#14213D]`}>
                Direct Agent Management
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#4A5568]">
                Submit inquiries directly, coordinate viewings, and manage rental/purchase offers without intermediate friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl border border-[#14213D] bg-[#14213D] px-8 py-16 text-center text-[#F7F5EF]">
          <h2 className={`${serif} text-3xl font-semibold sm:text-4xl`}>
            Ready to find your next property?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#EFEAE0]">
            Browse our complete catalog of houses, villas, and apartments available across Egypt.
          </p>

          <Link
            to="/properties"
            className={`${mono} mt-8 inline-block border border-[#F7F5EF] bg-[#FFFDF9] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#14213D] transition hover:bg-[#B8863B] hover:border-[#B8863B] hover:text-[#FFFDF9]`}
          >
            Explore Properties
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

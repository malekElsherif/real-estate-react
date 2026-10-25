import { Link } from "react-router-dom";

const btnLight = "no-underline rounded-xl border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10";

export const About = () => {
  const stats = [
    ["100+", "Curated Properties"],
    ["50+", "Verified Agents"],
    ["500+", "Satisfied Clients"],
    ["24/7", "Dedicated Support"],
  ];

  const features = [
    {
      step: "01",
      title: "Intuitive Filtering",
      description: "Search listings by status, type, location, and parameters to quickly locate properties matching your specs.",
    },
    {
      step: "02",
      title: "Verified Property Portfolio",
      description: "Explore residential and commercial spaces backdropped by verified ownership records and precise imagery.",
    },
    {
      step: "03",
      title: "Direct Agent Management",
      description: "Submit inquiries directly, coordinate viewings, and manage rental/purchase offers without intermediate friction.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <span className="inline-block rounded-full bg-amber-800/80 px-4 py-1 text-xs font-medium uppercase tracking-wider text-amber-100 backdrop-blur">
            About Estate
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find a place you'll <br />
            <span className="text-amber-300">love to call home.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone-300">
            We simplify finding, buying, and renting premium properties by connecting discerning clients with curated listings and trusted management.
          </p>
        </div>
      </section>

      {/* Who We Are & Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Who We Are
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Architectural Clarity & Modern Living
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-500 sm:text-base">
              Our platform provides an intentional, refined way to discover properties that match your lifestyle. Whether you're purchasing a permanent residence, securing a luxury rental, or managing high-end assets, we unify every step of the workflow.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-500 sm:text-base">
              From detailed spec sheets and verified imagery to direct agent communication and streamlined request tracking, we prioritize transparency and elegance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            {stats.map(([value, label], index) => (
              <div key={index} className="rounded-2xl bg-stone-50 p-6 text-center">
                <p className="text-3xl font-bold text-stone-900 sm:text-4xl">{value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-stone-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Why Choose Us
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Designed for Seamless Property Discovery
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col rounded-2xl border border-stone-100 bg-stone-50 p-8 shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-sm font-semibold text-amber-800">
                  {feature.step}
                </div>
                <h3 className="text-xl font-semibold text-stone-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-amber-800 to-stone-900 px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to find your next property?</h2>
          <p className="mx-auto mt-3 max-w-xl text-amber-100">
            Browse our complete catalog of houses, villas, and apartments available across Egypt.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/properties" className={btnLight}>
              Explore Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import { Link } from "react-router-dom";

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-7 py-3 text-sm font-medium text-white transition hover:bg-amber-900";
const btnLight = "no-underline rounded-xl border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10";

export const Contacts = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Headquarters",
      detail: "Tanta, El-Gharbiya, Egypt",
    },
    {
      icon: "📞",
      title: "Phone Support",
      detail: "01038339546",
    },
    {
      icon: "✉️",
      title: "Email Address",
      detail: "malek2062002@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <span className="inline-block rounded-full bg-amber-800/80 px-4 py-1 text-xs font-medium uppercase tracking-wider text-amber-100 backdrop-blur">
            Get In Touch
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            We’d Love to Hear <span className="text-amber-300">From You</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone-300">
            Have a question about a listed property, require administrative support, or wish to partner with us? Reach out and our team will assist promptly.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information Sidebar */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Contact Info</h2>
              <p className="mt-1 text-sm text-stone-500">
                Our support desk is available to resolve technical inquiries and guide property operations.
              </p>
            </div>

            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-start gap-4 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-stone-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm md:p-10">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                Send Us a Message
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Complete the fields below to dispatch your message directly to our admins.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@domain.com"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Inquiry topic..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your detailed inquiry..."
                    className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <button
                  type="submit"
                  className={`${btnPrimary} w-full cursor-pointer py-4`}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-amber-800 to-stone-900 px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">Looking for a Property?</h2>
          <p className="mx-auto mt-3 max-w-xl text-amber-100">
            Explore our curated residential listings and submit lease or purchase requests directly.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/properties" className={btnLight}>
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;

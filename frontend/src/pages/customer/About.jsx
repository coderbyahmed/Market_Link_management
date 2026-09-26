import { FaLeaf, FaTruck, FaHandHoldingHeart, FaSeedling, FaUsers, FaArrowRight } from "react-icons/fa";
import SectionHeading from "../../components/common/SectionHeading.jsx";

const About = () => {
  const values = [
    { icon: <FaLeaf />, title: "Farm Fresh", desc: "Produce harvested at peak ripeness and delivered within 24 hours." },
    { icon: <FaTruck />, title: "Direct Delivery", desc: "From farm to your doorstep — no middlemen, no extra markup." },
    { icon: <FaHandHoldingHeart />, title: "Fair Prices", desc: "Farmers earn more, you pay less. Everyone wins." },
    { icon: <FaSeedling />, title: "Sustainable", desc: "Supporting regenerative agriculture and local ecosystems." },
  ];

  const stats = [
    { value: "500+", label: "Partner Farmers" },
    { value: "50+", label: "Cities Served" },
    { value: "10K+", label: "Happy Customers" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const team = [
    { name: "Ahmed Khan", role: "Founder & CEO", bio: "Passionate about connecting farmers with consumers." },
    { name: "Sarah Ahmed", role: "Operations Head", bio: "Ensuring fresh produce reaches you on time." },
    { name: "Ali Raza", role: "Tech Lead", bio: "Building seamless farm-to-table experiences." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-brand-50 text-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              <FaLeaf className="h-4 w-4" /> About MarketLink
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Fresh Produce, Straight from the Farm
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-stone-600 leading-relaxed">
              We're on a mission to revolutionize how fresh produce reaches your table. 
              By connecting you directly with local farmers, we ensure the freshest produce at fair prices — 
              while empowering the growers who feed our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                eyebrow="Our Mission"
                title="Bringing the Farm to Your Table"
                description="We believe everyone deserves access to fresh, nutritious food — and farmers deserve fair compensation for their hard work."
              />
              <p className="mt-6 text-lg text-stone-600 leading-relaxed">
                MarketLink was born from a simple observation: farmers struggle to get fair prices for their produce, 
                while customers pay premium prices for produce that's traveled thousands of miles and lost its freshness.
              </p>
              <p className="mt-4 text-lg text-stone-600 leading-relaxed">
                By cutting out the middlemen, we create a direct bridge between local farmers and conscious consumers. 
                Farmers earn more, you pay less, and the produce is as fresh as it gets.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="font-display text-3xl font-bold text-brand-700">{stat.value}</div>
                    <div className="text-sm text-stone-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <FaLeaf className="mx-auto h-32 w-32 text-brand-300" />
                  <p className="mt-4 text-lg font-medium text-stone-700">Farm to Table</p>
                  <p className="mt-2 text-stone-500">Direct. Fresh. Fair.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title="What We Stand For"
            description="These principles guide every decision we make at MarketLink."
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  {value.icon}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-stone-900">{value.title}</h3>
                <p className="mt-2 text-stone-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Team"
            title="The People Behind MarketLink"
            description="A passionate team dedicated to transforming the food supply chain."
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-32 w-32 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <FaUsers className="h-16 w-16 text-brand-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-stone-900">{member.name}</h3>
                <p className="text-brand-600 font-medium">{member.role}</p>
                <p className="mt-2 text-sm text-stone-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-900 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Ready to Experience Farm-Fresh?
          </h2>
          <p className="mt-4 text-lg text-brand-200">
            Join thousands of customers enjoying the freshest produce delivered straight from local farms.
          </p>
          <a
            href="/customer/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-lg font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
          >
            Shop Fresh Produce
            <FaArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
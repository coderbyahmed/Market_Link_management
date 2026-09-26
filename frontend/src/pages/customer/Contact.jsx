import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaHeadset, FaChevronDown } from "react-icons/fa";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import { showSuccess } from "../../components/common/feedback/MessageProvider.jsx";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, title: "Visit Us", desc: "MarketLink HQ, 123 Farm Lane, Lahore, Pakistan" },
    { icon: <FaPhone />, title: "Call Us", desc: "+92 300 1234567 (Mon–Sat, 9AM–6PM)" },
    { icon: <FaEnvelope />, title: "Email Us", desc: "support@marketlink.com (24hr response)" },
    { icon: <FaClock />, title: "Business Hours", desc: "Monday–Saturday: 9AM–6PM, Sunday: Closed" },
  ];

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Most orders are delivered within 24 hours of placing. Fresh produce is harvested and packed the same day it ships.",
    },
    {
      q: "What if produce arrives damaged?",
      a: "We offer a freshness guarantee. Contact us within 2 hours of delivery with photos, and we'll issue a full refund or replacement.",
    },
    {
      q: "Do you deliver to my area?",
      a: "We currently serve 50+ cities across Pakistan. Enter your pin code at checkout to check availability.",
    },
    {
      q: "Can I schedule a recurring order?",
      a: "Yes! Set up a subscription for weekly or bi-weekly deliveries of your favorite produce and save 10%.",
    },
    {
      q: "How do you ensure produce freshness?",
      a: "Produce is harvested at peak ripeness, packed in temperature-controlled containers, and delivered within 24 hours.",
    },
    {
      q: "What payment methods do you accept?",
      a: "Cash on delivery, credit/debit cards, JazzCash, EasyPaisa, and bank transfers."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    showSuccess("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-brand-50 text-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              <FaHeadset /> Contact Us
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              We'd Love to Hear from You
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-stone-600 leading-relaxed">
              Have questions about your order, need help with your account, or want to partner with us?
              Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <SectionHeading
                eyebrow="Get in Touch"
                title="We're Here to Help"
                description="Choose the most convenient way to reach us."
              />
              <div className="mt-8 space-y-6">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">{item.title}</h3>
                      <p className="text-stone-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-brand-50 rounded-2xl p-8">
              <SectionHeading title="Send Us a Message" />
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-600">Name *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-600">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-stone-600">Subject *</label>
                  <select
                    id="subject"
                    required
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="quality">Quality Concern</option>
                    <option value="account">Account Help</option>
                    <option value="partnership">Farmer Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-stone-600">Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-brand-50" id="faqs">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQs"
            title="Frequently Asked Questions"
            description="Quick answers to common questions."
            align="center"
          />
          <div className="mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-stone-200 p-5"
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-stone-900">{faq.q}</span>
                  <FaChevronDown className="h-5 w-5 text-stone-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-stone-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-900 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-lg text-brand-200">
            Our support team is ready to assist you.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="tel:+923001234567"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-lg font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
            >
              <FaPhone /> Call Us
            </a>
            <a
              href="mailto:support@marketlink.com"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-3.5 text-lg font-semibold transition-colors hover:bg-brand-800"
            >
              <FaEnvelope /> Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
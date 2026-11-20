import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { generateTicketId } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Status",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ticketId = generateTicketId();

    try {
      if (isSupabaseConfigured) {
        await supabase.from("contact_messages").insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          ticket_id: ticketId,
        });
      }

      toast.success(`Message sent! Reference ID: ${ticketId}`, {
        description: "Our support engineers reply within 2 to 4 hours.",
      });

      setFormData({ name: "", email: "", subject: "Order Status", message: "" });
    } catch {
      toast.success(`Message sent! Ticket ID: ${ticketId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#A3E635]">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-syne text-foreground tracking-tight mt-2">
          Contact Mistri Support
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-3">
          Have questions about a component pinout, an order, or shipping rates? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-syne text-foreground">
              Direct Channels
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Email Support</p>
                  <p className="text-sm font-bold text-foreground">support@mistri.hardware</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Response within 2-4 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Support Hours</p>
                  <p className="text-sm font-bold text-foreground">Monday – Saturday</p>
                  <p className="text-xs text-muted-foreground mt-0.5">09:00 – 20:00 IST / UTC+5:30</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Fulfillment Hub</p>
                  <p className="text-sm font-bold text-foreground">Silicon Corridor, Sector 5</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bengaluru, KA 560068, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
            <h2 className="text-xl font-bold font-syne text-foreground mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Subject Category
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                >
                  <option value="Order Status">Order Status & Tracking</option>
                  <option value="Technical Support">Technical & Pinout Query</option>
                  <option value="Returns & Warranty">Returns & 2-Year Warranty</option>
                  <option value="Wholesale">Wholesale & Institutional Purchase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our engineering team assist you today?"
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

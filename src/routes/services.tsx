import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wrench, CircuitBoard, Layers, Users, Send, Check, Minus } from "lucide-react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: CircuitBoard,
    title: "Custom PCB Prototyping",
    description:
      "From Gerber files to assembled SMD boards in as fast as 5 business days. Dual-layer and multi-layer FR4 with lead-free ENIG finish.",
  },
  {
    icon: Wrench,
    title: "Robotics Calibration & Assembly",
    description:
      "Need pre-assembled and calibrated actuators or 6-DOF robotic arms? Our engineering team builds and tests them before dispatch.",
  },
  {
    icon: Layers,
    title: "Bulk Hardware Sourcing",
    description:
      "Enterprise and educational volume pricing for 10+ units. Direct factory procurement for microcontrollers, sensors, and dev kits.",
  },
  {
    icon: Users,
    title: "Maker Workshop & Curriculum",
    description:
      "Comprehensive STEM curriculum kits and live training sessions for schools, universities, and corporate maker spaces.",
  },
];

const COMPARISON_TIERS = [
  {
    feature: "Minimum Order Quantity",
    standard: "1 unit",
    pro: "5 units",
    enterprise: "25+ units",
  },
  {
    feature: "Component Sourcing Lead Time",
    standard: "3–5 days",
    pro: "24–48 hours",
    enterprise: "Immediate Priority",
  },
  {
    feature: "Electrical Pinout & Flash Verification",
    standard: "Basic automated",
    pro: "Multi-point manual",
    enterprise: "Full Oscilloscope & Logic Audit",
  },
  {
    feature: "Firmware Flashing & Custom Bootloader",
    standard: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "Dedicated Hardware Engineer Contact",
    standard: false,
    pro: "Slack / Email",
    enterprise: "24/7 Direct Hotline",
  },
  {
    feature: "Extended Replacement Warranty",
    standard: "1 Year",
    pro: "2 Years",
    enterprise: "3 Years White-Glove",
  },
];

function ServicesPage() {
  useSEO({
    title: "Engineering Services & Custom Prototyping | Mistri",
    description: "Custom PCB fabrication, robotic assembly, firmware burning, and bulk institutional component procurement.",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "Custom PCB Prototyping",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        await supabase.from("service_inquiries").insert({
          name: formData.name,
          email: formData.email,
          service_type: formData.serviceType,
          message: formData.message,
        });
      }
      toast.success("Inquiry submitted successfully!", {
        description: "An engineering specialist will review your project within 24 hours.",
      });
      setFormData({ name: "", email: "", serviceType: "Custom PCB Prototyping", message: "" });
    } catch {
      toast.success("Inquiry received! We will be in touch shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#A3E635]">
          Engineering Services
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-syne text-foreground tracking-tight mt-3">
          Hardware Solutions Beyond the Shelf.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mt-4 leading-relaxed">
          From custom firmware programming to rapid PCB fabrication, our engineering team brings your hardware vision to life.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="p-8 rounded-3xl border border-border bg-card space-y-4 hover:border-[#A3E635]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-syne text-foreground">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          );
        })}
      </div>

      {/* Service Tier Comparison Matrix */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-syne text-foreground">
            Service Tier Comparison
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Flexible engagement models tailored for individuals, labs, and volume manufacturers.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="py-4 px-6 font-syne font-bold text-foreground">Capability</th>
                  <th className="py-4 px-6 font-syne font-bold text-foreground">Maker Standard</th>
                  <th className="py-4 px-6 font-syne font-bold text-[#A3E635]">Lab Pro</th>
                  <th className="py-4 px-6 font-syne font-bold text-foreground">Enterprise Custom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON_TIERS.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{tier.feature}</td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {typeof tier.standard === "boolean" ? (
                        tier.standard ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Minus className="w-4 h-4 text-muted-foreground/40" />
                      ) : (
                        tier.standard
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-foreground bg-[#A3E635]/5">
                      {typeof tier.pro === "boolean" ? (
                        tier.pro ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Minus className="w-4 h-4 text-muted-foreground/40" />
                      ) : (
                        tier.pro
                      )}
                    </td>
                    <td className="py-4 px-6 text-foreground">
                      {typeof tier.enterprise === "boolean" ? (
                        tier.enterprise ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Minus className="w-4 h-4 text-muted-foreground/40" />
                      ) : (
                        tier.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold font-syne text-foreground mb-2 text-center">
          Request an Engineering Consultation
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Fill out the specs below and we'll reply with a preliminary quotation and timeline.
        </p>

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
              Service Type
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            >
              <option value="Custom PCB Prototyping">Custom PCB Prototyping</option>
              <option value="Robotics Calibration & Assembly">Robotics Calibration & Assembly</option>
              <option value="Bulk Hardware Sourcing">Bulk Hardware Sourcing (10+ units)</option>
              <option value="Maker Workshop & Curriculum">Maker Workshop & Curriculum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Project Description / Requirements
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your board specs, component requirements, or estimated batch size..."
              className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Send Engineering Inquiry"}
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

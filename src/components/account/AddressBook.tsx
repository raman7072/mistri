import { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Address } from "@/types/user";

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      user_id: "user-1",
      label: "Electronics Lab (Primary)",
      full_name: "Dr. Elena Vance",
      line1: "123 Silicon Boulevard, Suite 400",
      line2: "Aerospace Robotics Division",
      city: "Bengaluru",
      state: "KA",
      postal_code: "560068",
      country: "IN",
      is_default: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "addr-2",
      user_id: "user-1",
      label: "Home Workshop",
      full_name: "Elena Vance",
      line1: "45 Circuit Lane",
      line2: null,
      city: "Bengaluru",
      state: "KA",
      postal_code: "560034",
      country: "IN",
      is_default: false,
      created_at: new Date().toISOString(),
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "",
    fullName: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        is_default: a.id === id,
      }))
    );
    toast.success("Default shipping address updated.");
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.line1 || !newAddr.city) {
      toast.error("Please fill in required fields.");
      return;
    }

    const created: Address = {
      id: `addr-${Date.now()}`,
      user_id: "user-1",
      label: newAddr.label || "Delivery Address",
      full_name: newAddr.fullName,
      line1: newAddr.line1,
      line2: null,
      city: newAddr.city,
      state: newAddr.state,
      postal_code: newAddr.postalCode,
      country: "IN",
      is_default: addresses.length === 0,
      created_at: new Date().toISOString(),
    };

    setAddresses([...addresses, created]);
    setIsAdding(false);
    setNewAddr({ label: "", fullName: "", line1: "", city: "", state: "", postalCode: "" });
    toast.success("New address added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-syne text-foreground">
          Saved Delivery Addresses
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A3E635] text-black text-xs font-semibold hover:bg-[#A3E635]/90 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add Address
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-6 rounded-2xl border border-[#A3E635]/40 bg-card space-y-4">
          <h3 className="text-sm font-bold font-syne text-foreground">New Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Label</label>
              <input
                type="text"
                placeholder="e.g. Lab, Studio"
                value={newAddr.label}
                onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Recipient Name *</label>
              <input
                type="text"
                required
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={newAddr.line1}
              onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">City *</label>
              <input
                type="text"
                required
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">State *</label>
              <input
                type="text"
                required
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Postal Code *</label>
              <input
                type="text"
                required
                value={newAddr.postalCode}
                onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#A3E635] text-black text-xs font-semibold hover:bg-[#A3E635]/90"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl border bg-card flex flex-col justify-between transition-all ${
              addr.is_default ? "border-[#A3E635] ring-1 ring-[#A3E635]" : "border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-syne font-bold text-sm text-foreground">
                  {addr.label || "Address"}
                </span>
                {addr.is_default && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A3E635]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Default
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground">{addr.full_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{addr.line1}</p>
              {addr.line2 && <p className="text-xs text-muted-foreground">{addr.line2}</p>}
              <p className="text-xs text-muted-foreground mt-0.5">
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
              {!addr.is_default ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                >
                  Set as default
                </button>
              ) : (
                <span className="text-[11px] text-muted-foreground">Preferred shipping target</span>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                aria-label="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

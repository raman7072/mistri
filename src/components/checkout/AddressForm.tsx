import type { ShippingAddress } from "@/types/order";

interface AddressFormProps {
  address: ShippingAddress;
  email: string;
  onChange: (fields: Partial<ShippingAddress & { email: string }>) => void;
}

export function AddressForm({ address, email, onChange }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          Email Address for Order Updates *
        </label>
        <input
          type="email"
          required
          placeholder="alex@maker.com"
          value={email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          Full Name / Recipient *
        </label>
        <input
          type="text"
          required
          placeholder="Dr. Elena Vance"
          value={address.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          Street Address *
        </label>
        <input
          type="text"
          required
          placeholder="123 Silicon Boulevard, Suite 400"
          value={address.line1}
          onChange={(e) => onChange({ line1: e.target.value })}
          className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            City *
          </label>
          <input
            type="text"
            required
            placeholder="Bengaluru"
            value={address.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            State / Region *
          </label>
          <input
            type="text"
            required
            placeholder="KA"
            value={address.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Postal Code *
          </label>
          <input
            type="text"
            required
            placeholder="560068"
            value={address.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
        </div>
      </div>
    </div>
  );
}

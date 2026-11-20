import { Truck, Zap, Check } from "lucide-react";

interface ShippingMethodSelectorProps {
  selected: "standard" | "express";
  onSelect: (method: "standard" | "express") => void;
  isFreeShipping: boolean;
}

export function ShippingMethodSelector({
  selected,
  onSelect,
  isFreeShipping,
}: ShippingMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onSelect("standard")}
        className={`p-4 rounded-xl border text-left transition-all ${
          selected === "standard"
            ? "border-[#A3E635] bg-[#A3E635]/10 ring-1 ring-[#A3E635]"
            : "border-border hover:bg-muted"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm text-foreground">Standard Delivery</span>
          </div>
          <span className="text-xs font-bold text-[#A3E635]">
            {isFreeShipping ? "FREE" : "$5.99"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 pl-6">5–7 business days with GPS tracking</p>
      </button>

      <button
        type="button"
        onClick={() => onSelect("express")}
        className={`p-4 rounded-xl border text-left transition-all ${
          selected === "express"
            ? "border-[#A3E635] bg-[#A3E635]/10 ring-1 ring-[#A3E635]"
            : "border-border hover:bg-muted"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#A3E635]" />
            <span className="font-semibold text-sm text-foreground">Priority Express Air</span>
          </div>
          <span className="text-xs font-bold text-foreground">$14.99</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 pl-6">1–2 business days priority dispatch</p>
      </button>
    </div>
  );
}

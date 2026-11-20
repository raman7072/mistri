import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUploader";
import { CATEGORIES } from "@/lib/constants";

interface ListingWizardProps {
  onSuccess?: () => void;
}

export function ListingWizard({ onSuccess }: ListingWizardProps) {
  const [step, setStep] = useState(1);

  // Step 1: Info
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("robotics-kits");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Images
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  ]);

  // Step 3: Pricing & Variants
  const [price, setPrice] = useState("79.99");
  const [comparePrice, setComparePrice] = useState("99.99");
  const [sku, setSku] = useState("MST-KIT-01");
  const [stock, setStock] = useState("25");
  const [variants, setVariants] = useState<
    { title: string; sku: string; price: string; stock: string }[]
  >([]);

  // Step 4: Shipping & Status
  const [weightGrams, setWeightGrams] = useState("450");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addVariantRow = () => {
    setVariants([
      ...variants,
      {
        title: `Tier ${variants.length + 1}`,
        sku: `${sku}-V${variants.length + 1}`,
        price,
        stock: "15",
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Published "${title}" to the store catalog! 🚀`, {
        description: `Price: $${price} • Status: ${status}`,
      });
      onSuccess?.();
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8">
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        {[
          { num: 1, label: "Overview" },
          { num: 2, label: "Media" },
          { num: 3, label: "Pricing & Stock" },
          { num: 4, label: "Publish" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-syne transition-all ${
                step === s.num
                  ? "bg-[#A3E635] text-black ring-4 ring-[#A3E635]/20"
                  : step > s.num
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handlePublish}>
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ESP32-S3 Dual-Core AI Vision Sensor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Espressif, Arduino"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Search Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="wifi, bluetooth, camera, ai, esp32"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Technical Description & Features *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe clock speeds, pinouts, operating voltage, and included modules..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim()) {
                    toast.error("Please provide a title");
                    return;
                  }
                  setStep(2);
                }}
                className="h-11 px-6 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-sm"
              >
                Next: Media Upload <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Media Upload */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="font-syne font-bold text-base text-foreground mb-1">
                Hardware Product Images
              </h3>
              <p className="text-xs text-muted-foreground">
                High-resolution photos showcasing the board layout, interfaces, and packaging.
              </p>
            </div>

            <ImageUploader images={images} onChange={setImages} />

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-11 px-5 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <button
                type="button"
                onClick={() => {
                  if (images.length === 0) {
                    toast.error("Please attach at least one product photo.");
                    return;
                  }
                  setStep(3);
                }}
                className="h-11 px-6 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-sm"
              >
                Next: Pricing & Stock <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Variants */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Retail Price ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Compare-At / MSRP ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Available Stock Count *
                </label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>
            </div>

            {/* Optional Variants Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-syne uppercase tracking-wider text-foreground">
                  Custom Configurations / Variants ({variants.length})
                </span>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="inline-flex items-center gap-1 text-xs text-[#A3E635] font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Variant
                </button>
              </div>

              {variants.map((v, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Title (e.g. 16GB RAM)"
                    value={v.title}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].title = e.target.value;
                      setVariants(updated);
                    }}
                    className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].price = e.target.value;
                      setVariants(updated);
                    }}
                    className="w-24 h-10 px-3 rounded-lg border border-border bg-background text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].stock = e.target.value;
                      setVariants(updated);
                    }}
                    className="w-20 h-10 px-3 rounded-lg border border-border bg-background text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantRow(idx)}
                    className="p-2 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-11 px-5 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="h-11 px-6 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-sm"
              >
                Next: Finalize & Publish <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Shipping & Status */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Package Weight (Grams)
                </label>
                <input
                  type="number"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                >
                  <option value="active">Active (Visible in Catalog)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-xl border border-border bg-muted/20">
              <input
                type="checkbox"
                id="featCheck"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-[#A3E635]"
              />
              <label htmlFor="featCheck" className="text-xs font-semibold text-foreground cursor-pointer">
                Feature on Homepage (Highlight in "Featured Innovations" grid)
              </label>
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-1 text-xs">
              <div className="font-syne font-bold text-foreground text-sm">{title}</div>
              <div className="text-muted-foreground">
                Category: <strong className="text-foreground">{category}</strong> • Price:{" "}
                <strong className="text-[#A3E635]">${price}</strong> • Stock:{" "}
                <strong className="text-foreground">{stock} units</strong>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="h-11 px-5 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="h-12 px-8 rounded-xl bg-[#A3E635] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 disabled:opacity-50"
              >
                {submitting ? "Publishing SKU..." : "Publish Product Now"}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

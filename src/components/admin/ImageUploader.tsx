import { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | File[]) => {
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`Invalid format: ${file.name}. Only JPG, PNG, and WEBP supported.`);
        return;
      }
      // Validate file size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large: ${file.name} exceeds 5MB limit.`);
        return;
      }
      validFiles.push(file);
    });

    if (images.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed per listing.`);
      return;
    }

    // Convert to object URLs for preview / storage
    const newUrls = validFiles.map((f) => URL.createObjectURL(f));
    onChange([...images, ...newUrls]);
    toast.success(`Attached ${validFiles.length} hardware image(s).`);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#A3E635] bg-[#A3E635]/10 scale-[0.99]"
            : "border-border hover:border-border/80 bg-muted/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <UploadCloud className="w-6 h-6 text-[#A3E635]" />
        </div>

        <p className="text-xs sm:text-sm font-bold font-syne text-foreground">
          Click to upload or drag & drop hardware photos
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          JPG, PNG, or WEBP (Max 5MB per file • Up to {maxFiles} images)
        </p>
      </div>

      {/* Thumbnails preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden border border-border bg-card group"
            >
              <img
                src={url}
                alt={`Upload preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#A3E635]">
                  Primary Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

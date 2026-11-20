import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const criteria = useMemo(() => {
    return [
      { label: "At least 8 characters", valid: password.length >= 8 },
      { label: "Contains a number (0-9)", valid: /\d/.test(password) },
      { label: "Contains a lowercase letter", valid: /[a-z]/.test(password) },
      { label: "Contains an uppercase letter", valid: /[A-Z]/.test(password) },
      { label: "Contains a special character", valid: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const score = criteria.filter((c) => c.valid).length;

  const strength = useMemo(() => {
    if (!password) return { label: "", color: "bg-muted", width: "0%" };
    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 3) return { label: "Fair", color: "bg-amber-500", width: "50%" };
    if (score === 4) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-[#A3E635]", width: "100%" };
  }, [password, score]);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <span className="font-semibold text-foreground">{strength.label}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
        {criteria.map((c, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 text-[11px] ${
              c.valid ? "text-emerald-500 font-medium" : "text-muted-foreground"
            }`}
          >
            {c.valid ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            )}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

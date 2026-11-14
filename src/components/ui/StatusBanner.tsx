import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type Tone = "green" | "blue" | "amber" | "purple" | "red";

const TONES: Record<Tone, { box: string; icon: string; title: string; text: string; sub: string }> = {
  green:  { box: "bg-green-50 border-green-100",   icon: "text-green-600",  title: "text-green-800",  text: "text-green-700",  sub: "text-green-700" },
  blue:   { box: "bg-blue-50 border-blue-100",     icon: "text-blue-600",   title: "text-blue-800",   text: "text-blue-700",   sub: "text-blue-600" },
  amber:  { box: "bg-amber-50 border-amber-200",   icon: "text-amber-600",  title: "text-amber-800",  text: "text-amber-700",  sub: "text-amber-700" },
  purple: { box: "bg-purple-50 border-purple-100", icon: "text-purple-600", title: "text-purple-800", text: "text-purple-700", sub: "text-purple-600" },
  red:    { box: "bg-red-50 border-red-100",       icon: "text-red-600",    title: "text-red-800",    text: "text-red-700",    sub: "text-red-700" },
};

interface Props {
  tone: Tone;
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  note?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg";
}

export function StatusBanner({
  tone, icon: Icon, title, description, note, children, footer, size = "sm",
}: Props) {
  const t = TONES[tone];
  const box =
    size === "lg"
      ? "rounded-2xl p-3.5 sm:rounded-3xl sm:p-6"
      : "rounded-xl p-3 sm:rounded-2xl sm:p-5";
  const iconSize =
    size === "lg"
      ? "h-5 w-5 sm:h-[26px] sm:w-[26px]"
      : "h-[18px] w-[18px] sm:h-6 sm:w-6";

  return (
    <div className={`min-w-0 border ${box} ${t.box}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <Icon className={`shrink-0 ${iconSize} ${t.icon}`} />

        <div className="min-w-0 flex-1">
          <p className={`wrap-break-word text-[13px] font-bold leading-6 sm:text-base ${t.title}`}>
            {title}
          </p>

          {description && (
            <p className={`mt-1 wrap-break-word text-xs leading-6 sm:text-sm sm:leading-7 ${t.text}`}>
              {description}
            </p>
          )}

          {note && (
            <p className={`mt-1.5 wrap-break-word text-[11px] leading-5 sm:mt-2 sm:text-xs ${t.sub}`}>
              {note}
            </p>
          )}

          {children}
        </div>
      </div>

      {footer}
    </div>
  );
}
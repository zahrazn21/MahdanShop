export function PaymentBadge({ text, className }: { text: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {text}
    </span>
  );
}
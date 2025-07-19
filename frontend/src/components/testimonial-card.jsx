import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialCard({
  quote,
  author,
  variant = "default",
}) {
  const cardClasses =
    variant === "gradient"
      ? "bg-card border-border shadow-none rounded-xl theme-transition"
      : "bg-card border-border shadow-none rounded-xl theme-transition";

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <p className="text-muted-foreground text-left !text-sm italic mb-4 theme-transition">
          "{quote}"
        </p>
        <p className="text-primary !text-sm font-semibold text-left theme-transition">
          - {author}
        </p>
      </CardContent>
    </Card>
  );
}

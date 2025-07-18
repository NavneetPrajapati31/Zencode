import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialCard({
  quote,
  author,
  variant = "default",
}) {
  const cardClasses =
    variant === "gradient"
      ? "bg-gradient-to-br from-black to-primary/20 border-zinc-800 shadow-lg rounded-xl"
      : "bg-gradient-to-br from-black to-primary/20 border-zinc-800 shadow-lg rounded-xl";

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <p className="text-muted-foreground text-left !text-md italic mb-4">
          "{quote}"
        </p>
        <p className="text-primary !text-md font-semibold text-left">
          - {author}
        </p>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialCard({
  quote,
  author,
  variant = "default",
}) {
  const cardClasses =
    variant === "gradient"
      ? "bg-gradient-to-br from-black to-primary/30 border-zinc-800 shadow-lg rounded-xl"
      : "bg-gradient-to-br from-black to-primary/30 border-zinc-800 shadow-lg rounded-xl";

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <p className="text-muted-foreground !text-md italic mb-4">"{quote}"</p>
        <p className="text-primary !text-md font-semibold text-right">
          - {author}
        </p>
      </CardContent>
    </Card>
  );
}

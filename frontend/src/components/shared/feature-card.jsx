import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="bg-card border-border shadow-none hover:-translate-y-2 transition-all duration-300 rounded-xl py-6 gap-3 theme-transition-override">
      <CardHeader className="flex flex-col items-start px-6 text-left">
        {Icon && (
          <div className="p-3 rounded-full bg-primary/10 border-none mb-1.5 theme-transition">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <CardTitle className="text-lg font-semibold text-foreground theme-transition">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        <p className="text-muted-foreground text-left !font-light !text-sm theme-transition">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

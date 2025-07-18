import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="bg-card border-border shadow-none hover:bg-popover hover:scale-105 transition-all duration-300 rounded-xl py-6">
      <CardHeader className="flex flex-col items-start px-6 text-left">
        {Icon && (
          <div className="p-2 rounded-full bg-zinc-800/50 border border-zinc-800 mb-3">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <CardTitle className="text-lg font-semibold text-zinc-100">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        <p className="text-muted-foreground text-left !font-light !text-md">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="bg-black border-zinc-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="flex flex-col items-center text-center p-6 pb-0">
        {Icon && (
          <div className="p-3 rounded-full bg-zinc-800/50 border border-zinc-800 mb-4">
            <Icon className="h-6 w-6 text-amber-600" />
          </div>
        )}
        <CardTitle className="text-xl font-semibold text-zinc-100">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <p className="text-muted-foreground text-center mb-4">{description}</p>
      </CardContent>
    </Card>
  );
}

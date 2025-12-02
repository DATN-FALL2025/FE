import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ComingSoonProps {
  title?: string;
  description?: string;
  backLink?: string;
  backLabel?: string;
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "This feature is under development and will be available soon.",
  backLink,
  backLabel = "Go Back"
}: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground mb-6">
            {description}
          </p>
          {backLink && (
            <Link href={backLink}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

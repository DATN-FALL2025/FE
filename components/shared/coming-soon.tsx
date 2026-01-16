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
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full border-0 shadow-lg bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <CardContent className="p-10 text-center">
          {/* Animated Icon Container */}
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Construction className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 dark:bg-amber-500 animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-orange-400 dark:bg-orange-500 animate-pulse delay-150" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Back Button */}
          {backLink && (
            <Link href={backLink}>
              <Button
                variant="outline"
                className="gap-2 h-11 px-6 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200"
              >
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

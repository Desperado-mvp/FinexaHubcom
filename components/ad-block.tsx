import { cn } from "@/lib/utils"

interface AdBlockProps {
  position: "sidebar" | "in-content" | "footer"
  className?: string
}

export function AdBlock({ position, className }: AdBlockProps) {
  const sizes = {
    sidebar: "w-full h-[600px]",
    "in-content": "w-full h-[250px]",
    footer: "w-full h-[200px]",
  }

  return (
    <div className={cn("bg-muted border-2 border-border flex items-center justify-center", sizes[position], className)}>
      <div className="text-center space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Реклама</p>
        <p className="text-sm text-muted-foreground font-medium">
          {position === "sidebar" && "300 × 600"}
          {position === "in-content" && "728 × 90"}
          {position === "footer" && "970 × 250"}
        </p>
      </div>
    </div>
  )
}

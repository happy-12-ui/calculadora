import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SolutionDisplayProps {
  method: string;
  solution: number[] | null;
  steps: string[];
  determinant?: number;
}

export const SolutionDisplay = ({ method, solution, steps, determinant }: SolutionDisplayProps) => {
  if (!solution) {
    return (
      <Card className="p-6 bg-card/50 border-destructive/20">
        <h3 className="text-lg font-semibold mb-4 text-destructive">
          {method}
        </h3>
        <p className="text-muted-foreground">
          No se pudo resolver el sistema con este método.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 border-math-secondary/20 hover:border-math-secondary/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-math-secondary">
          {method}
        </h3>
        <Badge variant="secondary" className="bg-math-secondary/20 text-math-secondary">
          Resuelto
        </Badge>
      </div>

      {determinant !== undefined && (
        <div className="mb-4 p-3 bg-math-primary/10 rounded-lg">
          <p className="text-sm font-medium text-math-primary">
            Determinante: <span className="font-mono">{determinant.toFixed(4)}</span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Solución:</h4>
        <div className="grid gap-2">
          {solution.map((value, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-background/30 rounded">
              <span className="text-math-accent font-semibold">
                x<sub>{index + 1}</sub> =
              </span>
              <span className="font-mono text-lg font-bold text-math-primary">
                {value.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {steps.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-foreground mb-2">Pasos del proceso:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-sm text-muted-foreground p-2 bg-background/20 rounded">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
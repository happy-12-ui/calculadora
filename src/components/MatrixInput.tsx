import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface MatrixInputProps {
  size: number;
  matrix: number[][];
  constants: number[];
  onMatrixChange: (matrix: number[][], constants: number[]) => void;
}

export const MatrixInput = ({ size, matrix, constants, onMatrixChange }: MatrixInputProps) => {
  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    onMatrixChange(newMatrix, constants);
  };

  const handleConstantChange = (row: number, value: string) => {
    const newConstants = [...constants];
    newConstants[row] = parseFloat(value) || 0;
    onMatrixChange(matrix, newConstants);
  };

  return (
    <Card className="p-6 bg-card/50 border-math-primary/20">
      <h3 className="text-lg font-semibold mb-4 text-math-primary">
        Sistema de Ecuaciones {size}x{size}
      </h3>
      
      <div className="space-y-4">
        {Array.from({ length: size }, (_, row) => (
          <div key={row} className="flex items-center gap-2">
            {Array.from({ length: size }, (_, col) => (
              <div key={col} className="flex items-center gap-1">
                <Input
                  type="number"
                  step="any"
                  value={matrix[row][col] || ''}
                  onChange={(e) => handleMatrixChange(row, col, e.target.value)}
                  className="w-16 h-12 text-center bg-background/50 border-math-primary/30"
                  placeholder="0"
                />
                {col < size - 1 && (
                  <span className="text-math-secondary font-semibold">
                    x<sub>{col + 1}</sub> +
                  </span>
                )}
              </div>
            ))}
            <span className="text-math-secondary font-semibold mx-2">
              x<sub>{size}</sub> =
            </span>
            <Input
              type="number"
              step="any"
              value={constants[row] || ''}
              onChange={(e) => handleConstantChange(row, e.target.value)}
              className="w-16 h-12 text-center bg-math-accent/10 border-math-accent/30"
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
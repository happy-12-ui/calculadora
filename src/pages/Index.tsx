import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MatrixInput } from "@/components/MatrixInput";
import { SolutionDisplay } from "@/components/SolutionDisplay";
import { solveByInverse, solveByCramer, solveByGaussJordan } from "@/utils/matrixOperations";
import { Calculator, BookOpen, Users } from "lucide-react";

const Index = () => {
  const [matrixSize, setMatrixSize] = useState<number>(2);
  const [matrix, setMatrix] = useState<number[][]>([[0, 0], [0, 0]]);
  const [constants, setConstants] = useState<number[]>([0, 0]);
  const [solutions, setSolutions] = useState<{
    inverse: any;
    cramer: any;
    gaussJordan: any;
  } | null>(null);

  const initializeMatrix = (size: number) => {
    const newMatrix = Array(size).fill(0).map(() => Array(size).fill(0));
    const newConstants = Array(size).fill(0);
    setMatrix(newMatrix);
    setConstants(newConstants);
    setSolutions(null);
  };

  const handleMatrixSizeChange = (value: string) => {
    const size = parseInt(value);
    setMatrixSize(size);
    initializeMatrix(size);
  };

  const handleMatrixChange = (newMatrix: number[][], newConstants: number[]) => {
    setMatrix(newMatrix);
    setConstants(newConstants);
    setSolutions(null);
  };

  const solveSystem = () => {
    const inverse = solveByInverse(matrix, constants);
    const cramer = solveByCramer(matrix, constants);
    const gaussJordan = solveByGaussJordan(matrix, constants);

    setSolutions({
      inverse,
      cramer,
      gaussJordan
    });
  };

  const loadExample = () => {
    if (matrixSize === 2) {
      setMatrix([[2, 1], [1, 1]]);
      setConstants([3, 2]);
    } else if (matrixSize === 3) {
      setMatrix([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]]);
      setConstants([8, -11, -3]);
    }
    setSolutions(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-math-primary to-math-secondary p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">
              Sistema de Ecuaciones Lineales
            </h1>
          </div>
          <p className="text-blue-100">
            Resuelve sistemas de ecuaciones usando Inversa de Matrices, Cramer y Gauss-Jordan
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <Card className="p-6 mb-8 bg-card/50 border-math-primary/20">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-math-primary" />
              <label className="font-semibold text-foreground">Tamaño del sistema:</label>
              <Select value={matrixSize.toString()} onValueChange={handleMatrixSizeChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2x2</SelectItem>
                  <SelectItem value="3">3x3</SelectItem>
                  <SelectItem value="4">4x4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={loadExample} 
              variant="outline"
              className="border-math-secondary text-math-secondary hover:bg-math-secondary/10"
            >
              <Users className="h-4 w-4 mr-2" />
              Cargar Ejemplo
            </Button>
            
            <Button 
              onClick={solveSystem}
              className="bg-math-primary hover:bg-math-primary/90 text-white shadow-lg hover:shadow-[var(--shadow-glow)]"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Resolver Sistema
            </Button>
          </div>
        </Card>

        {/* Matrix Input */}
        <div className="mb-8">
          <MatrixInput
            size={matrixSize}
            matrix={matrix}
            constants={constants}
            onMatrixChange={handleMatrixChange}
          />
        </div>

        {/* Solutions */}
        {solutions && (
          <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
            <SolutionDisplay
              method="Método de Inversa de Matrices"
              solution={solutions.inverse.solution}
              steps={solutions.inverse.steps}
              determinant={solutions.inverse.determinant}
            />
            <SolutionDisplay
              method="Método de Cramer"
              solution={solutions.cramer.solution}
              steps={solutions.cramer.steps}
              determinant={solutions.cramer.determinant}
            />
            <SolutionDisplay
              method="Método de Gauss-Jordan"
              solution={solutions.gaussJordan.solution}
              steps={solutions.gaussJordan.steps}
            />
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-math-accent/5 border-math-accent/20">
          <h2 className="text-xl font-semibold mb-4 text-math-accent">Información Académica</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Método de Inversa</h3>
              <p className="text-muted-foreground">
                Utiliza la matriz inversa A⁻¹ para resolver x = A⁻¹b. 
                Requiere que det(A) ≠ 0.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Método de Cramer</h3>
              <p className="text-muted-foreground">
                Calcula cada variable usando determinantes. 
                xᵢ = det(Aᵢ)/det(A) donde Aᵢ reemplaza la columna i.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Gauss-Jordan</h3>
              <p className="text-muted-foreground">
                Transforma la matriz aumentada a forma escalonada reducida 
                mediante operaciones elementales.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;

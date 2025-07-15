export interface SolutionResult {
  solution: number[] | null;
  steps: string[];
  determinant?: number;
}

// Método de Inversa de Matrices
export const solveByInverse = (matrix: number[][], constants: number[]): SolutionResult => {
  const steps: string[] = [];
  const n = matrix.length;
  
  steps.push("Método de Inversa de Matrices");
  steps.push("1. Calculando determinante de la matriz A");
  
  const det = calculateDeterminant(matrix);
  steps.push(`   Determinante = ${det.toFixed(4)}`);
  
  if (Math.abs(det) < 1e-10) {
    steps.push("   El determinante es cero, el sistema no tiene solución única");
    return { solution: null, steps, determinant: det };
  }
  
  steps.push("2. Calculando matriz inversa A⁻¹");
  const inverse = calculateInverse(matrix);
  if (!inverse) {
    return { solution: null, steps, determinant: det };
  }
  
  steps.push("3. Multiplicando A⁻¹ × b para obtener x");
  const solution = multiplyMatrixVector(inverse, constants);
  steps.push("   Solución obtenida: x = A⁻¹ × b");
  
  return { solution, steps, determinant: det };
};

// Método de Cramer
export const solveByCramer = (matrix: number[][], constants: number[]): SolutionResult => {
  const steps: string[] = [];
  const n = matrix.length;
  
  steps.push("Método de Cramer");
  steps.push("1. Calculando determinante principal");
  
  const mainDet = calculateDeterminant(matrix);
  steps.push(`   Determinante principal = ${mainDet.toFixed(4)}`);
  
  if (Math.abs(mainDet) < 1e-10) {
    steps.push("   El determinante principal es cero, no se puede aplicar Cramer");
    return { solution: null, steps, determinant: mainDet };
  }
  
  const solution: number[] = [];
  
  steps.push("2. Calculando determinantes para cada variable:");
  
  for (let i = 0; i < n; i++) {
    const tempMatrix = matrix.map(row => [...row]);
    
    // Reemplazar columna i con el vector de constantes
    for (let j = 0; j < n; j++) {
      tempMatrix[j][i] = constants[j];
    }
    
    const detI = calculateDeterminant(tempMatrix);
    solution[i] = detI / mainDet;
    
    steps.push(`   x${i + 1}: det(A${i + 1}) = ${detI.toFixed(4)}, x${i + 1} = ${solution[i].toFixed(4)}`);
  }
  
  return { solution, steps, determinant: mainDet };
};

// Método de Gauss-Jordan
export const solveByGaussJordan = (matrix: number[][], constants: number[]): SolutionResult => {
  const steps: string[] = [];
  const n = matrix.length;
  
  // Crear matriz aumentada
  const augmented = matrix.map((row, i) => [...row, constants[i]]);
  
  steps.push("Método de Gauss-Jordan");
  steps.push("1. Matriz aumentada inicial:");
  steps.push(formatMatrix(augmented));
  
  // Eliminación hacia adelante
  for (let i = 0; i < n; i++) {
    // Encontrar el pivote
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    
    // Intercambiar filas si es necesario
    if (maxRow !== i) {
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      steps.push(`2.${i + 1} Intercambiando filas ${i + 1} y ${maxRow + 1}`);
    }
    
    // Verificar si el pivote es cero
    if (Math.abs(augmented[i][i]) < 1e-10) {
      steps.push(`   Pivote en posición [${i + 1},${i + 1}] es cero, sistema inconsistente`);
      return { solution: null, steps };
    }
    
    // Normalizar fila pivote
    const pivot = augmented[i][i];
    for (let j = 0; j <= n; j++) {
      augmented[i][j] /= pivot;
    }
    steps.push(`2.${i + 1} Normalizando fila ${i + 1} (dividiendo por ${pivot.toFixed(4)})`);
    
    // Eliminación en toda la columna
    for (let k = 0; k < n; k++) {
      if (k !== i && Math.abs(augmented[k][i]) > 1e-10) {
        const factor = augmented[k][i];
        for (let j = 0; j <= n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
        steps.push(`   Eliminando en fila ${k + 1} (factor: ${factor.toFixed(4)})`);
      }
    }
  }
  
  steps.push("3. Matriz en forma escalonada reducida:");
  steps.push(formatMatrix(augmented));
  
  // Extraer solución
  const solution = augmented.map(row => row[n]);
  
  return { solution, steps };
};

// Funciones auxiliares
function calculateDeterminant(matrix: number[][]): number {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  
  // Para matrices más grandes, usar eliminación gaussiana
  const temp = matrix.map(row => [...row]);
  let det = 1;
  
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(temp[k][i]) > Math.abs(temp[maxRow][i])) {
        maxRow = k;
      }
    }
    
    if (maxRow !== i) {
      [temp[i], temp[maxRow]] = [temp[maxRow], temp[i]];
      det *= -1;
    }
    
    if (Math.abs(temp[i][i]) < 1e-10) return 0;
    
    det *= temp[i][i];
    
    for (let k = i + 1; k < n; k++) {
      const factor = temp[k][i] / temp[i][i];
      for (let j = i; j < n; j++) {
        temp[k][j] -= factor * temp[i][j];
      }
    }
  }
  
  return det;
}

function calculateInverse(matrix: number[][]): number[][] | null {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
  
  // Gauss-Jordan para encontrar la inversa
  for (let i = 0; i < n; i++) {
    if (Math.abs(augmented[i][i]) < 1e-10) return null;
    
    const pivot = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }
    
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }
  
  return augmented.map(row => row.slice(n));
}

function multiplyMatrixVector(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row => 
    row.reduce((sum, val, i) => sum + val * vector[i], 0)
  );
}

function formatMatrix(matrix: number[][]): string {
  return matrix.map(row => 
    `[ ${row.map(val => val.toFixed(3).padStart(8)).join(' ')} ]`
  ).join('\n');
}
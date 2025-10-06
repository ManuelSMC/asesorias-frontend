export interface Division {
  idDivision: number;
  nombre: string;
  status: boolean;
  clave: string;
  descripcion: string;
  director: string;
}

export interface ProgramaEducativo {
  idProgramaEducativo: number;
  nombre: string;
  status: boolean;
  clave: string;
  descripcion: string;
  division: Division;
}

export interface ProgramaEducativoDTO {
  idProgramaEducativo?: number;
  nombre: string;
  status: boolean;
  clave: string;
  descripcion: string;
  divisionId: number;
}
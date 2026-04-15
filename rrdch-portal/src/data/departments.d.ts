export interface Department {
  name: string;
  nameKn: string;
  treats: string[];
  avgTimePerPatient: number;
  description: string;
}

export type DeptCode = 
  | 'oral-medicine'
  | 'conservative-dentistry'
  | 'periodontology'
  | 'pedodontics'
  | 'orthodontics'
  | 'oral-surgery'
  | 'prosthodontics'
  | 'public-health'
  | 'oral-pathology'
  | 'implantology';

export const DEPARTMENTS: Record<DeptCode, Department>;
export const DEPARTMENT_CODES: DeptCode[];
export function getDepartmentName(code: string, lang?: 'en' | 'kn'): string;

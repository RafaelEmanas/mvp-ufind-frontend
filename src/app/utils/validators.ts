import { COLLEGE_ID_LENGTH } from '../constants/app.constants';

export function isValidCollegeEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  return trimmed.endsWith('@icomp.ufam.edu.br') || trimmed.endsWith('@ufam.edu.br');
}

export function isValidCollegeId(id: string): boolean {
  return id.length === COLLEGE_ID_LENGTH;
}

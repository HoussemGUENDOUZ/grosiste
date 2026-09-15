export function formatClientCode(id: number): string {
  return `CL${String(id).padStart(5, '0')}`;
}
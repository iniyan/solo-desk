import path from 'path';

const DATA_ROOT = path.join(process.cwd(), 'solo-desk-data');

export function getDataRoot(): string {
  return DATA_ROOT;
}

export function dailyFilePath(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  return path.join(DATA_ROOT, year, month, `${dateStr}.md`);
}

export function dailyDirPath(year: string, month: string): string {
  return path.join(DATA_ROOT, year, month);
}

export function orgFilePath(slug: string): string {
  return path.join(DATA_ROOT, 'organizations', `${slug}.md`);
}

export function orgDirPath(): string {
  return path.join(DATA_ROOT, 'organizations');
}

export function templateFilePath(slug: string): string {
  return path.join(DATA_ROOT, 'templates', `${slug}.md`);
}

export function templateDirPath(): string {
  return path.join(DATA_ROOT, 'templates');
}

export function configFilePath(): string {
  return path.join(DATA_ROOT, 'settings', 'config.json');
}

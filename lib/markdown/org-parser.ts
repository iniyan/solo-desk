import { readFile, writeFile, readdir, rename, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import matter from 'gray-matter';
import { Organization } from '../types';
import { orgFilePath, orgDirPath } from '../data-path';

export async function parseOrgFile(slug: string): Promise<Organization | null> {
  const filePath = orgFilePath(slug);
  if (!existsSync(filePath)) return null;

  const content = await readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  return {
    slug: data.slug || slug,
    name: data.name || slug,
    color: data.color || '#3B82F6',
    notes: body.replace(/^## Notes\n?/, '').trim(),
  };
}

export async function writeOrgFile(org: Organization): Promise<void> {
  const filePath = orgFilePath(org.slug);
  const content = matter.stringify(`\n## Notes\n${org.notes}\n`, {
    name: org.name,
    slug: org.slug,
    color: org.color,
  });

  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, content, 'utf-8');
  await rename(tmpPath, filePath);
}

export async function listOrganizations(): Promise<Organization[]> {
  const dir = orgDirPath();
  if (!existsSync(dir)) return [];

  const files = await readdir(dir);
  const orgs: Organization[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace('.md', '');
    const org = await parseOrgFile(slug);
    if (org) orgs.push(org);
  }

  return orgs;
}

export async function deleteOrgFile(slug: string): Promise<void> {
  const filePath = orgFilePath(slug);
  if (existsSync(filePath)) await unlink(filePath);
}

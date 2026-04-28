import { readFile, writeFile, readdir, rename, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import matter from 'gray-matter';
import { TaskTemplate, Priority, RevenueTag } from '../types';
import { templateFilePath, templateDirPath } from '../data-path';

export async function parseTemplateFile(slug: string): Promise<TaskTemplate | null> {
  const filePath = templateFilePath(slug);
  if (!existsSync(filePath)) return null;

  const content = await readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  const tasks = body
    .split('\n')
    .filter(l => l.trim().startsWith('- '))
    .map(l => {
      const text = l.trim().replace(/^- /, '');
      const parts = text.split('|').map(p => p.trim());
      return {
        title: parts[0] || '',
        description: parts[1] || '',
        org: parts[2] || '',
        priority: (parts[3]?.toLowerCase() || 'medium') as Priority,
        revenueTag: (parts[4]?.toLowerCase() || 'billable') as RevenueTag,
      };
    })
    .filter(t => t.title);

  return {
    slug: data.slug || slug,
    name: data.name || slug,
    tasks,
  };
}

export async function writeTemplateFile(template: TaskTemplate): Promise<void> {
  const filePath = templateFilePath(template.slug);
  const taskLines = template.tasks
    .map(t => `- ${t.title} | ${t.description} | ${t.org} | ${t.priority} | ${t.revenueTag}`)
    .join('\n');

  const content = matter.stringify(`\n## Tasks\n${taskLines}\n`, {
    name: template.name,
    slug: template.slug,
  });

  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, content, 'utf-8');
  await rename(tmpPath, filePath);
}

export async function listTemplates(): Promise<TaskTemplate[]> {
  const dir = templateDirPath();
  if (!existsSync(dir)) return [];

  const files = await readdir(dir);
  const templates: TaskTemplate[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace('.md', '');
    const tpl = await parseTemplateFile(slug);
    if (tpl) templates.push(tpl);
  }

  return templates;
}

export async function deleteTemplateFile(slug: string): Promise<void> {
  const filePath = templateFilePath(slug);
  if (existsSync(filePath)) await unlink(filePath);
}

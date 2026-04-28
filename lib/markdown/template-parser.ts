import { kv } from '../kv';
import { TaskTemplate } from '../types';

const TPL_PREFIX = 'template:';
const TPL_INDEX_KEY = 'template:__index';

export async function parseTemplateFile(slug: string): Promise<TaskTemplate | null> {
  const tpl = await kv.get<TaskTemplate>(`${TPL_PREFIX}${slug}`);
  return tpl || null;
}

export async function writeTemplateFile(template: TaskTemplate): Promise<void> {
  await kv.set(`${TPL_PREFIX}${template.slug}`, template);

  const index = (await kv.get<string[]>(TPL_INDEX_KEY)) || [];
  if (!index.includes(template.slug)) {
    index.push(template.slug);
    await kv.set(TPL_INDEX_KEY, index);
  }
}

export async function listTemplates(): Promise<TaskTemplate[]> {
  const index = (await kv.get<string[]>(TPL_INDEX_KEY)) || [];
  const templates: TaskTemplate[] = [];

  for (const slug of index) {
    const tpl = await kv.get<TaskTemplate>(`${TPL_PREFIX}${slug}`);
    if (tpl) templates.push(tpl);
  }

  return templates;
}

export async function deleteTemplateFile(slug: string): Promise<void> {
  await kv.del(`${TPL_PREFIX}${slug}`);

  const index = (await kv.get<string[]>(TPL_INDEX_KEY)) || [];
  const updated = index.filter(s => s !== slug);
  await kv.set(TPL_INDEX_KEY, updated);
}

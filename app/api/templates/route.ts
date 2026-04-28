import { NextResponse } from 'next/server';
import { listTemplates, writeTemplateFile } from '@/lib/markdown/template-parser';
import { TaskTemplate } from '@/lib/types';

export async function GET() {
  const templates = await listTemplates();
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const body = await request.json();

  const slug = (body.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) return NextResponse.json({ error: 'Invalid name' }, { status: 400 });

  const template: TaskTemplate = {
    slug,
    name: body.name,
    tasks: body.tasks || [],
  };

  await writeTemplateFile(template);
  return NextResponse.json(template, { status: 201 });
}

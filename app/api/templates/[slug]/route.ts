import { NextResponse } from 'next/server';
import { parseTemplateFile, writeTemplateFile, deleteTemplateFile } from '@/lib/markdown/template-parser';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const template = await parseTemplateFile(slug);
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(template);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  const existing = await parseTemplateFile(slug);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = {
    ...existing,
    name: body.name ?? existing.name,
    tasks: body.tasks ?? existing.tasks,
  };

  await writeTemplateFile(updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteTemplateFile(slug);
  return NextResponse.json({ success: true });
}

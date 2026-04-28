import { NextResponse } from 'next/server';
import { parseOrgFile, writeOrgFile, deleteOrgFile } from '@/lib/markdown/org-parser';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const org = await parseOrgFile(slug);
  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(org);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  const existing = await parseOrgFile(slug);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = {
    ...existing,
    name: body.name ?? existing.name,
    color: body.color ?? existing.color,
    notes: body.notes ?? existing.notes,
  };

  await writeOrgFile(updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteOrgFile(slug);
  return NextResponse.json({ success: true });
}

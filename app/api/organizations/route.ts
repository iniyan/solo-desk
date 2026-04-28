import { NextResponse } from 'next/server';
import { listOrganizations, writeOrgFile } from '@/lib/markdown/org-parser';
import { Organization } from '@/lib/types';

export async function GET() {
  const orgs = await listOrganizations();
  return NextResponse.json(orgs);
}

export async function POST(request: Request) {
  const body = await request.json();

  const slug = (body.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) return NextResponse.json({ error: 'Invalid name' }, { status: 400 });

  const org: Organization = {
    slug,
    name: body.name,
    color: body.color || '#3B82F6',
    notes: body.notes || '',
  };

  await writeOrgFile(org);
  return NextResponse.json(org, { status: 201 });
}

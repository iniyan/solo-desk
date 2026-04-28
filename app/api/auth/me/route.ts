import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { User } from '@/lib/types';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await kv.get<User>(`user:${session.email}`);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ email: user.email, name: user.name });
}

import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { User } from '@/lib/types';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await kv.get<User>(`user:${email.toLowerCase()}`);
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await createSession(user.email);
  const response = NextResponse.json({ email: user.email, name: user.name });
  return setSessionCookie(response, token);
}

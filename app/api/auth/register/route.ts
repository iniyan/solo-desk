import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { User } from '@/lib/types';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
  }

  const existing = await kv.get<User>(`user:${email.toLowerCase()}`);
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  }

  const user: User = {
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    name,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`user:${user.email}`, user);

  const token = await createSession(user.email);
  const response = NextResponse.json({ email: user.email, name: user.name }, { status: 201 });
  return setSessionCookie(response, token);
}

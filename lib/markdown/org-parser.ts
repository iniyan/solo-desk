import { kv } from '../kv';
import { Organization } from '../types';

const ORG_PREFIX = 'org:';
const ORG_INDEX_KEY = 'org:__index';

export async function parseOrgFile(slug: string): Promise<Organization | null> {
  const org = await kv.get<Organization>(`${ORG_PREFIX}${slug}`);
  return org || null;
}

export async function writeOrgFile(org: Organization): Promise<void> {
  await kv.set(`${ORG_PREFIX}${org.slug}`, org);

  const index = (await kv.get<string[]>(ORG_INDEX_KEY)) || [];
  if (!index.includes(org.slug)) {
    index.push(org.slug);
    await kv.set(ORG_INDEX_KEY, index);
  }
}

export async function listOrganizations(): Promise<Organization[]> {
  const index = (await kv.get<string[]>(ORG_INDEX_KEY)) || [];
  const orgs: Organization[] = [];

  for (const slug of index) {
    const org = await kv.get<Organization>(`${ORG_PREFIX}${slug}`);
    if (org) orgs.push(org);
  }

  return orgs;
}

export async function deleteOrgFile(slug: string): Promise<void> {
  await kv.del(`${ORG_PREFIX}${slug}`);

  const index = (await kv.get<string[]>(ORG_INDEX_KEY)) || [];
  const updated = index.filter(s => s !== slug);
  await kv.set(ORG_INDEX_KEY, updated);
}

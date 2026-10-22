import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { Vehicle } from '@/lib/vehicles';

const SESSION_COOKIE = 'akob_catalog_admin';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const CATALOG_PATH = 'data/vehicles.json';

type GitHubConfig = { token: string; repository: string; branch: string };
type GitHubFile = { path: string; content: string; encoding?: 'utf-8' | 'base64' };

export function isGithubAdminConfigured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.ADMIN_PASSWORD);
}

function getConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) {
    throw new Error('GitHub non configuré : renseignez GITHUB_TOKEN, GITHUB_REPOSITORY et un ADMIN_PASSWORD de 16 caractères minimum.');
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) throw new Error('GITHUB_REPOSITORY doit être au format propriétaire/dépôt.');
  return { token, repository, branch: process.env.GITHUB_BRANCH || 'main' };
}

function apiUrl(config: GitHubConfig, path: string) {
  return `https://api.github.com/repos/${config.repository}/${path}`;
}

async function githubRequest<T>(config: GitHubConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(config, path), {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(`GitHub a refusé l’opération (${response.status})${result?.message ? ` : ${result.message}` : '.'}`);
  }
  return response.json() as Promise<T>;
}

function signSession(expires: number) {
  return createHmac('sha256', getConfig().token).update(`${expires}:${process.env.ADMIN_PASSWORD}`).digest('hex');
}

export function verifyAdminPassword(value: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof value !== 'string' || !expected) return false;
  const actualBytes = Buffer.from(value);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export async function startGithubAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${expires}.${signSession(expires)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearGithubAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function hasGithubAdminSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expiresText, signature] = value.split('.');
  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = Buffer.from(signSession(expires));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function readGithubVehicles(fallback: Vehicle[]): Promise<Vehicle[]> {
  const config = getConfig();
  const path = `contents/${CATALOG_PATH}?ref=${encodeURIComponent(config.branch)}`;
  const response = await fetch(apiUrl(config, path), {
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (response.status === 404) return fallback;
  if (!response.ok) throw new Error(`Impossible de lire le catalogue GitHub (${response.status}).`);
  const file = await response.json() as { content?: string; encoding?: string };
  if (file.encoding !== 'base64' || !file.content) throw new Error('Le fichier du catalogue GitHub est invalide.');
  const parsed: unknown = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
  if (!Array.isArray(parsed)) throw new Error('Le catalogue GitHub doit contenir une liste de véhicules.');
  return parsed as Vehicle[];
}

export async function commitGithubCatalog(files: GitHubFile[], deletePaths: string[] = []) {
  const config = getConfig();
  const ref = await githubRequest<{ object: { sha: string } }>(config, `git/ref/heads/${encodeURIComponent(config.branch)}`);
  const parent = await githubRequest<{ tree: { sha: string } }>(config, `git/commits/${ref.object.sha}`);

  const treeEntries: Array<{ path: string; mode: '100644'; type: 'blob'; sha: string | null }> = await Promise.all(files.map(async (file) => {
    const blob = await githubRequest<{ sha: string }>(config, 'git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content: file.content, encoding: file.encoding ?? 'utf-8' }),
    });
    return { path: file.path, mode: '100644', type: 'blob', sha: blob.sha };
  }));
  treeEntries.push(...deletePaths.map((path) => ({ path, mode: '100644' as const, type: 'blob' as const, sha: null })));

  const tree = await githubRequest<{ sha: string }>(config, 'git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: parent.tree.sha, tree: treeEntries }),
  });
  const commit = await githubRequest<{ sha: string }>(config, 'git/commits', {
    method: 'POST',
    body: JSON.stringify({ message: 'Update vehicle catalog', tree: tree.sha, parents: [ref.object.sha] }),
  });
  await githubRequest(config, `git/refs/heads/${encodeURIComponent(config.branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
}

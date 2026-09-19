import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  ContentPost,
  Database,
  Escalation,
  EscalationKind,
  EscalationStatus,
  Prospect,
  ProspectSource,
  ProspectStatus,
} from "./types";

// Server-only: this reads/writes a local JSON file. On a serverless/read-only
// filesystem (e.g. Vercel), writes silently won't persist across invocations —
// swap this module for a real database (Supabase/Postgres) before deploying there.
const DB_PATH = path.join(process.cwd(), "data", "db.json");

const EMPTY_DB: Database = { prospects: [], posts: [], escalations: [] };

let cache: Database | null = null;

async function ensureFile(): Promise<void> {
  await mkdir(path.dirname(DB_PATH), { recursive: true });
  try {
    await readFile(DB_PATH, "utf-8");
  } catch {
    await writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), "utf-8");
  }
}

async function readDb(): Promise<Database> {
  if (cache) return cache;
  await ensureFile();
  const raw = await readFile(DB_PATH, "utf-8");
  cache = JSON.parse(raw) as Database;
  return cache;
}

async function writeDb(db: Database): Promise<void> {
  cache = db;
  await ensureFile();
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function now(): string {
  return new Date().toISOString();
}

// ---------- Prospects ----------

export async function listProspects(): Promise<Prospect[]> {
  const db = await readDb();
  return [...db.prospects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProspect(id: string): Promise<Prospect | undefined> {
  const db = await readDb();
  return db.prospects.find((p) => p.id === id);
}

export async function getProspectBySession(chatSessionId: string): Promise<Prospect | undefined> {
  const db = await readDb();
  return db.prospects.find((p) => p.chatSessionId === chatSessionId);
}

export async function createProspect(input: {
  name: string;
  email?: string;
  phone?: string;
  source: ProspectSource;
  interest?: string;
  status?: ProspectStatus;
  note?: string;
  chatSessionId?: string;
}): Promise<Prospect> {
  const db = await readDb();
  const timestamp = now();
  const prospect: Prospect = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    status: input.status ?? "nouveau",
    source: input.source,
    interest: input.interest,
    notes: input.note ? [input.note] : [],
    createdAt: timestamp,
    updatedAt: timestamp,
    chatSessionId: input.chatSessionId,
  };
  db.prospects.push(prospect);
  await writeDb(db);
  return prospect;
}

export async function updateProspect(
  id: string,
  changes: Partial<Pick<Prospect, "status" | "interest" | "email" | "phone" | "name">> & {
    addNote?: string;
    touchContact?: boolean;
  }
): Promise<Prospect | undefined> {
  const db = await readDb();
  const prospect = db.prospects.find((p) => p.id === id);
  if (!prospect) return undefined;

  if (changes.status) prospect.status = changes.status;
  if (changes.interest !== undefined) prospect.interest = changes.interest;
  if (changes.email !== undefined) prospect.email = changes.email;
  if (changes.phone !== undefined) prospect.phone = changes.phone;
  if (changes.name !== undefined) prospect.name = changes.name;
  if (changes.addNote) prospect.notes.push(changes.addNote);
  if (changes.touchContact) prospect.lastContactedAt = now();
  prospect.updatedAt = now();

  await writeDb(db);
  return prospect;
}

// ---------- Content / social posts ----------

export async function listPosts(): Promise<ContentPost[]> {
  const db = await readDb();
  return [...db.posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createPost(input: {
  title: string;
  body: string;
  platforms: ContentPost["platforms"];
  productRef?: string;
  scheduledFor?: string;
}): Promise<ContentPost> {
  const db = await readDb();
  const timestamp = now();
  const post: ContentPost = {
    id: randomUUID(),
    title: input.title,
    body: input.body,
    platforms: input.platforms,
    productRef: input.productRef,
    status: input.scheduledFor ? "planifie" : "brouillon",
    scheduledFor: input.scheduledFor,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  db.posts.push(post);
  await writeDb(db);
  return post;
}

export async function updatePostStatus(
  id: string,
  status: ContentPost["status"],
  publishResult?: string
): Promise<ContentPost | undefined> {
  const db = await readDb();
  const post = db.posts.find((p) => p.id === id);
  if (!post) return undefined;
  post.status = status;
  if (publishResult !== undefined) post.publishResult = publishResult;
  post.updatedAt = now();
  await writeDb(db);
  return post;
}

// ---------- Escalations (human approval queue) ----------

export async function listEscalations(): Promise<Escalation[]> {
  const db = await readDb();
  return [...db.escalations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createEscalation(input: {
  kind: EscalationKind;
  summary: string;
  details: string;
  prospectId?: string;
}): Promise<Escalation> {
  const db = await readDb();
  const escalation: Escalation = {
    id: randomUUID(),
    kind: input.kind,
    summary: input.summary,
    details: input.details,
    prospectId: input.prospectId,
    status: "en_attente",
    createdAt: now(),
  };
  db.escalations.push(escalation);
  await writeDb(db);
  return escalation;
}

export async function resolveEscalation(
  id: string,
  status: EscalationStatus,
  resolutionNote?: string
): Promise<Escalation | undefined> {
  const db = await readDb();
  const escalation = db.escalations.find((e) => e.id === id);
  if (!escalation) return undefined;
  escalation.status = status;
  escalation.resolutionNote = resolutionNote;
  escalation.resolvedAt = now();
  await writeDb(db);
  return escalation;
}

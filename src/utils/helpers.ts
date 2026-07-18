import slugifyLib from "slugify";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

export function uniqueSlug(text: string): string {
  const base = slugify(text);
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
}

export function sanitizeString(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export function parsePositiveInt(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function omitPassword<T extends { password?: string }>(
  user: T
): Omit<T, "password"> {
  const { password: _password, ...rest } = user;
  return rest;
}

export function calculateProfileCompletion(user: {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  image?: string;
  skills?: string[];
  experience?: unknown[];
  education?: unknown[];
  resume?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  location?: string;
}): { percentage: number; missing: string[] } {
  const checks: Array<{ key: string; label: string; ok: boolean }> = [
    { key: "name", label: "Name", ok: Boolean(user.name) },
    { key: "email", label: "Email", ok: Boolean(user.email) },
    { key: "phone", label: "Phone", ok: Boolean(user.phone) },
    { key: "bio", label: "Bio", ok: Boolean(user.bio) },
    { key: "image", label: "Profile Photo", ok: Boolean(user.image) },
    { key: "skills", label: "Skills", ok: Boolean(user.skills && user.skills.length > 0) },
    {
      key: "experience",
      label: "Experience",
      ok: Boolean(user.experience && user.experience.length > 0),
    },
    {
      key: "education",
      label: "Education",
      ok: Boolean(user.education && user.education.length > 0),
    },
    { key: "resume", label: "Resume", ok: Boolean(user.resume) },
    { key: "portfolio", label: "Portfolio", ok: Boolean(user.portfolio) },
    { key: "github", label: "GitHub", ok: Boolean(user.github) },
    { key: "linkedin", label: "LinkedIn", ok: Boolean(user.linkedin) },
    { key: "location", label: "Location", ok: Boolean(user.location) },
  ];

  const completed = checks.filter((c) => c.ok).length;
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  const percentage = Math.round((completed / checks.length) * 100);

  return { percentage, missing };
}

import slugifyLib from "slugify";
export function slugify(text) {
    return slugifyLib(text, { lower: true, strict: true, trim: true });
}
export function uniqueSlug(text) {
    const base = slugify(text);
    const suffix = Date.now().toString(36);
    return `${base}-${suffix}`;
}
export function sanitizeString(value) {
    return value.replace(/[<>]/g, "").trim();
}
export function parsePositiveInt(value, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1)
        return fallback;
    return Math.floor(n);
}
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
export function omitPassword(user) {
    const { password: _password, ...rest } = user;
    return rest;
}
export function calculateProfileCompletion(user) {
    const checks = [
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
//# sourceMappingURL=helpers.js.map
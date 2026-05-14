// Lightweight cn() utility — merges class names, filters out falsy values.
// No external dependencies needed (no clsx/tailwind-merge).
export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
    return inputs.filter(Boolean).join(' ');
}

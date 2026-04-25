import { randomUUID } from 'crypto';

export const generateId = (): string => randomUUID();

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

export const sanitizeIp = (ip: string | undefined): string | undefined => {
  if (!ip) return undefined;
  // Strip IPv4-mapped IPv6 prefix
  return ip.replace(/^::ffff:/, '');
};

export const parseUserAgent = (ua: string | undefined) => {
  if (!ua) return { isMobile: false, isBot: false, raw: undefined };
  return {
    isMobile: /mobile/i.test(ua),
    isBot: /bot|crawler|spider|scraper/i.test(ua),
    raw: ua,
  };
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result as Omit<T, K>;
};

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
};

export const toISODateString = (date: Date | string): string =>
  new Date(date).toISOString();

export const daysBetween = (a: Date, b: Date): number =>
  Math.abs(Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));

export const hashString = async (value: string): Promise<string> => {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(value).digest('hex');
};

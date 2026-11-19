type RouteParams = Record<string, string | string[] | undefined>;

const decodeSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

export function getPageClassName(pathname: string, params: RouteParams = {}): string {
  const paramValues = new Set(Object.values(params).flat());
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => (paramValues.has(decodeSegment(segment)) ? 'details' : segment));

  return `${segments.length > 0 ? segments.join('-') : 'home'}-index`;
}

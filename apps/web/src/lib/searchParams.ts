export type SearchParams = Record<string, string | string[] | undefined>;

export type SearchParamChanges = Record<string, string | undefined>;

export const getParam = (params: SearchParams, name: string): string | undefined => {
  const value = params[name];
  return typeof value === 'string' ? value : undefined;
};

export const getOtherParams = (params: SearchParams, name: string) =>
  Object.entries(params).filter(
    (entry): entry is [string, string] => entry[0] !== name && typeof entry[1] === 'string',
  );

export const buildUrl = (pathname: string, params: SearchParams, changes: SearchParamChanges) => {
  const query = new URLSearchParams();

  for (const [name, value] of Object.entries({ ...params, ...changes })) {
    if (typeof value === 'string' && value !== '') {
      query.set(name, value);
    }
  }

  const search = query.toString();
  return search ? `${pathname}?${search}` : pathname;
};

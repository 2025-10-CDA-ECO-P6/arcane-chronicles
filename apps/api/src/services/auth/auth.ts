import argon2, { type HashOptions } from 'argon2';

const hashingOptions: HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

export const hashPassword = (password: string): Promise<string> =>
  argon2.hash(password, hashingOptions);

let dummyHash: Promise<string> | undefined;

const getDummyHash = () => {
  dummyHash ??= argon2.hash('arcane-chronicles-dummy-password', hashingOptions);
  return dummyHash;
};

export const verifyPassword = async (
  hash: string | undefined,
  password: string,
): Promise<boolean> => {
  if (!hash) {
    await argon2.verify(await getDummyHash(), password);
    return false;
  }

  return argon2.verify(hash, password);
};

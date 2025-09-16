declare const hashPasswordUtils: (plainPassword: string) => Promise<string | undefined>;
declare const comparePasswordUtils: (loginPassword: string, dbPassword: string) => Promise<boolean | undefined>;
export { hashPasswordUtils, comparePasswordUtils };

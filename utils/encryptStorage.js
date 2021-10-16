import { EncryptStorage } from "storage-encryption";

export const encryptStorage = new EncryptStorage(
  process.env.NEXT_PUBLIC_SECRET_TOKEN,
  "localStorage"
);

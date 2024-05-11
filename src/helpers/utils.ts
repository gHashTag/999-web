import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sliceAddress = (address: string) =>
  `${address.slice(0, 8)}...${address.slice(-8)}`;

export function makeRandomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const randomString = makeRandomString(32);

export const extractProjectName = (url: string) => {
  const regex = /^https:\/\/([^.]+)\./;
  const match = url.match(regex);
  if (match?.[1]) {
    return match[1];
  }
  return null;
};

export const isValidProjectName = (text?: string) => {
  if (!text) return false;
  const regex = /^[a-zA-Z]*$/;

  return regex.test(text);
};

export const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

import * as z from "zod";

/** Native `<input type="number">` values are always strings on the form —
 * these keep the form field a string end-to-end and only coerce to a
 * number in the parsed (submitted) output. */
export function requiredNumberString(message: string) {
  return z
    .string()
    .trim()
    .min(1, message)
    .refine((v) => !Number.isNaN(Number(v)), "Must be a valid number.")
    .transform((v) => Number(v));
}

export function optionalNumberString() {
  return z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(Number(v)), "Must be a valid number.")
    .transform((v) => (v === "" ? null : Number(v)));
}

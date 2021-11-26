import Ajv from "ajv";

import { FromV7Schema } from "index";

var ajv = new Ajv();

describe("Null schema", () => {
  const nullSchema = { type: "null" } as const;

  type Null = FromV7Schema<typeof nullSchema>;
  let nullInstance: Null;

  it("accepts null const", () => {
    nullInstance = null;
    expect(ajv.validate(nullSchema, nullInstance)).toBe(true);
  });

  it("rejects other values", () => {
    // @ts-expect-error
    nullInstance = "not null";
    expect(ajv.validate(nullSchema, nullInstance)).toBe(false);
  });
});

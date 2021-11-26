import Ajv from "ajv";

import { FromV7Schema } from "index";

var ajv = new Ajv();

describe("Number schemas", () => {
  const numberSchema = { type: "number" } as const;

  type Number = FromV7Schema<typeof numberSchema>;
  let numberInstance: Number;

  it("accepts any number value", () => {
    numberInstance = 42;
    expect(ajv.validate(numberSchema, numberInstance)).toBe(true);
  });

  it("rejects other values", () => {
    // @ts-expect-error
    numberInstance = ["not", "a", "number"];
    expect(ajv.validate(numberSchema, numberInstance)).toBe(false);
  });
});

import { JSONSchema7 as $JSONSchema7 } from "json-schema";

export type JSONSchema7 = Omit<
  $JSONSchema7,
  | "const"
  | "enum"
  | "items"
  | "additionalItems"
  | "contains"
  | "properties"
  | "patternProperties"
  | "additionalProperties"
  | "dependencies"
  | "propertyNames"
  | "if"
  | "then"
  | "else"
  | "allOf"
  | "anyOf"
  | "oneOf"
  | "not"
  | "definitions"
> & {
  const?: unknown;
  enum?: unknown;
  items?: boolean | JSONSchema7 | (boolean | JSONSchema7)[];
  additionalItems?: boolean | JSONSchema7;
  contains?: JSONSchema7;
  properties?: Record<string, boolean | JSONSchema7>;
  patternProperties?: Record<string, boolean | JSONSchema7>;
  additionalProperties?: boolean | JSONSchema7;
  dependencies?: {
    [key: string]: boolean | JSONSchema7 | string[];
  };
  propertyNames?: boolean | JSONSchema7;
  // TODO: add boolean
  if?: JSONSchema7;
  // TODO: add boolean
  then?: JSONSchema7;
  // TODO: add boolean
  else?: JSONSchema7;
  // TODO: add boolean
  allOf?: JSONSchema7[];
  // TODO: add boolean
  anyOf?: JSONSchema7[];
  // TODO: add boolean
  oneOf?: JSONSchema7[];
  // TODO: add boolean
  not?: JSONSchema7;
  definitions?: {
    [key: string]: boolean | JSONSchema7;
  };
};

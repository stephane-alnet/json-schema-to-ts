import { M } from "@stephanealnet-signalwire/ts-algebra";
import { A } from "ts-toolbelt";

import { JSONSchema7 } from "../definitions";
import { HasKeyIn } from "../utils";

import { ParseSchema, ParseSchemaOptions } from "./index";

export type EnumSchema = JSONSchema7 & { enum: unknown[] };

export type ParseEnumSchema<
  S extends EnumSchema,
  O extends ParseSchemaOptions
  // TOIMPROVE: Directly use ParseConstSchema, ParseMultipleTypeSchema etc...
> = HasKeyIn<S, "const" | "type"> extends true
  ? M.$Intersect<ParseEnum<S>, ParseSchema<Omit<S, "enum">, O>>
  : ParseEnum<S>;

type ParseEnum<S extends EnumSchema> = M.Enum<A.Compute<S["enum"][number]>>;

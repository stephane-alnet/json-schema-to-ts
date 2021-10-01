// import { M } from "ts-algebra";
// import { A } from "ts-toolbelt";

// import { JSONSchema7 } from "definitions";

// import { ParseSchema } from "../parse-schema";
// import { HasKeyIn } from "../utils";

// import { MergeSubSchema } from "./utils";

// export type ParseIfThenElseSchema<
//   S extends JSONSchema7,
//   R extends JSONSchema7 = Omit<S, "if" | "then" | "else">
// > = HasKeyIn<
//   S,
//   "enum" | "const" | "type" | "anyOf" | "oneOf" | "allOf" | "not"
// > extends true
//   ? // @ts-expect-error
//     IntersectWithParentSchema<S, R>
//   : ApplyIfThenElse<S, R>;

// type IntersectWithParentSchema<
//   S extends JSONSchema7,
//   R extends JSONSchema7,
//   // @ts-expect-error
//   $T extends any = ApplyIfThenElse<S, R>,
//   T extends M.Type = $T extends M.Type ? $T : M.Error<"">,
//   $P extends any = ParseSchema<R>,
//   P extends M.Type = $P extends M.Type ? $P : M.Error<"">
// > = M.Intersect<T, P>;

// type ApplyIfThenElse<
//   S extends JSONSchema7,
//   R extends JSONSchema7,
//   I extends JSONSchema7 = A.Cast<MergeSubSchema<R, S["if"]>, JSONSchema7>,
//   $T extends any = ParseSchema<I>,
//   T extends M.Type = $T extends M.Type ? $T : M.Error<"">
//   // @ts-expect-error
// > = M.Union<
//   | ("then" extends keyof S
//       ? // @ts-expect-error
//         IntersectIfAndThen<T, A.Cast<MergeSubSchema<R, S["then"]>, JSONSchema7>>
//       : T)
//   // @ts-expect-error
//   | ExcludeIfFromElse<T, S, R>
// >;

// type IntersectIfAndThen<
//   I extends M.Type,
//   T extends JSONSchema7,
//   $P extends any = ParseSchema<T>,
//   P extends M.Type = $P extends M.Type ? $P : M.Error<"">
// > = M.Intersect<I, P>;

// type ExcludeIfFromElse<
//   T extends M.Type,
//   S extends JSONSchema7,
//   R extends JSONSchema7,
//   E extends JSONSchema7 = A.Cast<
//     "else" extends keyof S ? MergeSubSchema<R, S["else"]> : R,
//     JSONSchema7
//   >,
//   $P extends any = ParseSchema<E>,
//   P extends M.Type = $P extends M.Type ? $P : M.Error<"">
// > = M.Exclude<P, T>;

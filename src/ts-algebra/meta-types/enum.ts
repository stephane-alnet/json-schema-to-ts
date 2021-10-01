import { A, B } from "ts-toolbelt";

export type EnumId = "enum";

export type Enum<V extends unknown> = { type: EnumId; values: V };

export type EnumType = Enum<unknown>;

export type EnumValues<E extends EnumType> = E["values"];

export type ResolveEnum<E extends EnumType> = EnumValues<E>;

export type IsEnumRepresentable<E extends EnumType> = A.Equals<
  EnumValues<E>,
  never
> extends B.True
  ? false
  : true;

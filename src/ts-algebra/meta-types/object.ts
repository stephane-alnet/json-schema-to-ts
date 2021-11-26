import { A, B } from "ts-toolbelt";

import { DoesExtend, Or, Not, DeepMergeUnsafe } from "../utils";

import { Any, Never, Error, Type } from ".";
import { IsRepresentable } from "./isRepresentable";
import { Resolve } from "./resolve";

export type ObjectId = "object";

export type Object<
  V extends Record<A.Key, Type> = {},
  R extends A.Key = never,
  P extends Type = Never,
  $O extends any = IsRepresentable<P>,
  O extends boolean = $O extends boolean ? $O : false
> = {
  type: ObjectId;
  values: V;
  required: R;
  openProps: P;
  isOpen: O;
};

export type $Object<V = {}, R = never, P = Never> = V extends Record<
  A.Key,
  Type
>
  ? P extends Type
    ? // @ts-expect-error
      Object<V, R extends infer K ? (K extends A.Key ? K : never) : never, P>
    : Error<"Third Type argument provided to $Tuple does not extend Meta.Type">
  : Error<"First Type argument provided to $Tuple does not extend Record<string, Meta.Type>">;

export type ObjectType = {
  type: ObjectId;
  values: Record<A.Key, Type>;
  required: A.Key;
  openProps: Type;
  isOpen: boolean;
};

export type ObjectValues<O extends ObjectType> = O["values"];

export type Value<
  O extends ObjectType,
  K extends A.Key
> = K extends keyof ObjectValues<O>
  ? ObjectValues<O>[K]
  : IsOpen<O> extends true
  ? OpenProps<O>
  : Never;

export type Required<O extends ObjectType> = O["required"];

export type OpenProps<O extends ObjectType> = O["openProps"];

export type IsOpen<O extends ObjectType> = O["isOpen"];

type IsObjectValueRepresentable<
  O extends ObjectType,
  K extends A.Key
> = K extends keyof ObjectValues<O>
  ? IsRepresentable<ObjectValues<O>[K]>
  : IsOpen<O>;

export type IsObjectRepresentable<O extends ObjectType> = Or<
  // TODO: Work only with ts-toolbelt Booleans
  DoesExtend<A.Equals<Required<O>, never>, B.True>,
  Not<
    DoesExtend<
      false,
      {
        [key in Required<O>]: IsObjectValueRepresentable<O, key>;
      }[Required<O>]
    >
  >
>;

type ResolveRepresentableObject<O extends ObjectType> = DeepMergeUnsafe<
  IsOpen<O> extends true
    ? A.Equals<ObjectValues<O>, {}> extends B.True
      ? { [key: string]: Resolve<OpenProps<O>> }
      : { [key: string]: Resolve<Any> }
    : {},
  DeepMergeUnsafe<
    {
      [key in Exclude<keyof ObjectValues<O>, Required<O>>]?: Resolve<
        ObjectValues<O>[key]
      >;
    },
    {
      [key in Required<O>]: key extends keyof ObjectValues<O>
        ? Resolve<ObjectValues<O>[key]>
        : Resolve<Any>;
    }
  >
>;

export type ResolveObject<O extends ObjectType> =
  IsObjectRepresentable<O> extends true ? ResolveRepresentableObject<O> : never;

export type NonRepresentableKeys<O extends Record<A.Key, Type>> = {
  [key in keyof O]: IsRepresentable<O[key]> extends false ? key : never;
}[keyof O];

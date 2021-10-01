export type ConstId = "const";

export type Const<V extends unknown> = {
  type: ConstId;
  value: V;
};

export type ConstType = Const<unknown>;

export type ConstValue<C extends ConstType> = C["value"];

export type ResolveConst<T extends ConstType> = ConstValue<T>;

import { List, Record } from "immutable";
import { isUndefined, isString } from "util";

export function JSONreviver(key: any, value: any) {
  if (Array.isArray(value)) {
    return List(value);
  }
  if (value !== undefined && value !== null && value.constructor === Object) {
    return new (Record(value));
  }
  return value;
}

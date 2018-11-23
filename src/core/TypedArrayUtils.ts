/**
 * Copyright (c) 2018 The xterm.js authors. All rights reserved.
 * @license MIT
 */

/**
 * polyfill for TypedArray.fill
 * This is needed to support .fill in all safari versions and IE 11.
 */

type TypedArray = Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray
  | Int8Array | Int16Array | Int32Array
  | Float32Array | Float64Array;

export function fill(array: TypedArray, value: number, start: number = 0, end?: number | undefined): TypedArray {
  // all modern engines that support .fill
  if (array.fill) {
    return array.fill(value, start, end);
  }
  // safari and IE 11
  // since IE 11 does not support Array.prototype.fill either
  // we cannot use the suggested polyfill from MDN
  // instead we simply fall back to looping
  if (start >= array.length) {
    return array;
  }
  start = (array.length + start) % array.length;
  if (end === undefined) {
    end = array.length;
  }
  if (end >= array.length) {
    end = array.length;
  } else {
    end = (array.length + end) % array.length;
  }
  for (let i = start; i < end; ++i) {
    array[i] = value;
  }
  return array;
}

export function slice<T extends TypedArray>(array: T, start?: number, end?: number): T {
  // all modern engines that support .slice
  if (array.slice) {
    return array.slice(start, end) as T;
  }
  return sliceFallback(array, start, end);
}

export function sliceFallback<T extends TypedArray>(array: T, start: number = 0, end: number = array.length): T {
  if (start < 0) {
    start = (array.length + start) % array.length;
  }
  if (end >= array.length) {
    end = array.length;
  } else {
    end = (array.length + end) % array.length;
  }
  start = Math.min(start, end);

  const result: T = new (<any>array).__proto__.constructor(end - start);
  for (let i = 0; i < end - start; ++i) {
    result[i] = array[i + start];
  }
  return result;
}

import { i as isObjectLike, b as baseGetTag, S as Symbol$1, a as isArray } from './isArray.js';
var symbolTag = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' || (isObjectLike(value) && baseGetTag(value) == symbolTag);
}
function arrayMap(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length,
    result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var INFINITY = 1 / 0;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0,
  symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
function toString(value) {
  return value == null ? '' : baseToString(value);
}
export { arrayMap as a, isSymbol as i, toString as t };

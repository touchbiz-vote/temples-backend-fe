import { LocationQueryValue } from "vue-router";

export function convertKeysToCamelCase(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  }

  const camelCaseObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      camelCaseObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
    }
  }

  return camelCaseObj;
}

export function convertToNumber(value: LocationQueryValue): number | undefined {
  if (typeof value === 'number') {
    // 如果已经是数字，直接返回
    return value;
  } else if (typeof value === 'string') {
    // 如果是字符串，尝试将其解析为数字
    const parsedNumber = parseFloat(value);
    if (!isNaN(parsedNumber)) {
      return parsedNumber;
    }
  } else if (Array.isArray(value) && value.length > 0) {
    // 如果是字符串数组，尝试将第一个元素解析为数字
    const firstElement = value[0];
    if (typeof firstElement === 'string') {
      const parsedNumber = parseFloat(firstElement);
      if (!isNaN(parsedNumber)) {
        return parsedNumber;
      }
    }
  }

  // 如果无法转换，则返回 undefined 或者其他默认值
  return undefined;
}

export function cloneObjectKey<T extends object, V>(
  base: T,
  initialValue: V
): Record<keyof T, V> {
  return Object.keys(base).reduce((acc, key) => {
    const value =
      typeof initialValue === "object" && initialValue !== null
        ? structuredClone(initialValue)
        : initialValue;

    acc[key as keyof T] = value;
    return acc;
  }, {} as Record<keyof T, V>);
}

function cloneObjectKeyAndValue<
  T extends Record<string, any>,
  K extends keyof any
>(base: T, field: string): Record<keyof T, any> {
  const result: Record<string, any> = {};
  for (const key in base) {
    if (base[key] && typeof base[key] === "object" && field in base[key]) {
      result[key] = base[key][field];
    }
  }
  return result as Record<keyof T, any>;
}

/**
 * This function renames a key to the provided value in a JSON object.
 * @param obj The object in which the key should be replaced.
 * @param oldKey The name of the key that should be replaced.
 * @param newKey The new name for the key that should be replaced.
 */
export function renameKey(obj: any, oldKey: string, newKey: string) {
    if (oldKey in obj) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }
    return obj;
}
export function renameKey(obj: any, oldKey: string, newKey: string) {
    if (oldKey in obj) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }
    return obj;
}
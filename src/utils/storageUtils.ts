// storageUtils.ts

export function updateSessionStorage(key: string, data: { [key: string]: unknown }): void {
    const dataString = JSON.stringify(data);
    sessionStorage.setItem(key, dataString);
}

export function getFromSessionStorage(key: string): { [key: string]: unknown } | null {
    const dataString = sessionStorage.getItem(key);
    if (dataString) {
        return JSON.parse(dataString) as { [key: string]: unknown };
    }
    return null;
}
// urlUtils.ts

export function getUrlSearchParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
}

export function getUrlSearchParam(name: string) {
    const urlSearchParams = getUrlSearchParams();
    return  urlSearchParams.get(name);
}

export function updateUrlSearchParams(params: { name: string; value: string }[]): void {
    const urlSearchParams = getUrlSearchParams();

    if (params?.length) {
        params.forEach((p) => urlSearchParams.set(p.name, p.value));
        window.location.href = `${location.href.split('?')[0]}?${urlSearchParams.toString()}`;
    }
}

export function deleteUrlSearchParam(name: string): void {
    const urlSearchParams = getUrlSearchParams();
    urlSearchParams.delete(name);
    window.location.href = `${location.href.split('?')[0]}?${urlSearchParams.toString()}`;
}

export function isUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (error) {
        return false; // Invalid URL
    }
}
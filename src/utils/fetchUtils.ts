// fetchUtils.ts
import {ElMessage} from "element-plus";

export async function fetchData(url: string) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log(response);

            ElMessage({
                offset: 42,
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: `<strong>Fetch Data Error: </strong> ${response.status} ${response.statusText} <i>${response.url.substring(0, 25)}...${response.url.slice(-10)}</i>`,
                type: "error"
            });
        }

        return await response.json();
    } catch (error) {
        ElMessage({
            offset: 42,
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `<strong>Fetch Error: </strong> ${(error as Error).message}`,
            type: "error"
        });
        throw error;
    }
}
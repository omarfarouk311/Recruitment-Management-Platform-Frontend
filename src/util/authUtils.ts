import axios from "axios";

export async function authRefreshToken() {
    try {
        await axios.post("/auth/refresh-token", {});
    } catch (err) {
        if(axios.isAxiosError(err)) {
            if(err.response?.status === 401) {
                window.location.href = "/login";
            }
        }
    }
}



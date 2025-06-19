import axios from "axios";
import config from "../../config/config";

export async function authRefreshToken() {
    try {
        await axios.post(`${config.API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        return true;
    }
    catch (err) {
        window.location.href = "/login";
        console.error("Error refreshing token:", err);
        return false;
    }
}
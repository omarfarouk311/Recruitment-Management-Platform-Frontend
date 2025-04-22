import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function authRefreshToken() {
    const navigate = useNavigate();

    try {
        await axios.post("/auth/refresh-token", {});
    }
    catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            navigate('/login');
        }
    }
}
import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function authRefreshToken() {
    const navigate = useNavigate();

    try {
        await axios.post("/auth/refresh-token", {});
        return true;
    }
    catch (err) {
        navigate('/login');
        return false;
    }
}
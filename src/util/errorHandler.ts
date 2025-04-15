import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showErrorToast = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
        style: {
            borderLeft: '4px solid #ff4444'
        }
    });
};
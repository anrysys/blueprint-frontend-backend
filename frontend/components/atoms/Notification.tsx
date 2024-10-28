// components/atoms/Notification.tsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message: string) => toast.success(message);
export const notifyError = (message: string) => toast.error(message);
export const notifyWarning = (message: string) => toast.warn(message);

export default function Notification() {
  return <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />;
}
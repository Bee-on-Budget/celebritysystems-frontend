// src/components/ToastNotifier.jsx
import { Toaster, toast } from "react-hot-toast";

export const showToast = (message, type = "success") => {
  const commonStyle = {
    position: "top-center",
    duration: 2000,
    style: {
      padding: "16px",
      borderRadius: "12px",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, {
        ...commonStyle,
        style: { ...commonStyle.style, background: "#4BB543" },
      });
      break;
    case "error":
      toast.error(message, {
        ...commonStyle,
        style: { ...commonStyle.style, background: "#FF3333" },
      });
      break;
    case "warning":
      toast(message, {
        icon: "⚠️",
        ...commonStyle,
        style: { ...commonStyle.style, background: "#FFA500" },
      });
      break;
    case "info":
      toast(message, {
        icon: "ℹ️",
        ...commonStyle,
        style: { ...commonStyle.style, background: "#2D9CDB" },
      });
      break;
    default:
      toast(message, commonStyle);
  }
};

const ToastNotifier = () => <Toaster />;

export default ToastNotifier;

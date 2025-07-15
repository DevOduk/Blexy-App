import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

let triggerPopup;

const PopupContainer = () => {
  const [popup, setPopup] = useState(null);
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    triggerPopup = (type, message) => {
      setPopup({ type, message });
      setAnimClass("popup-enter");

      // Exit animation after 2.5s
      setTimeout(() => setAnimClass("popup-exit"), 5000);

      // Remove popup after animation finishes
      setTimeout(() => setPopup(null), 5500);
    };
  }, []);

  if (!popup) return null;

  const styles = {
    base: {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "8px 25px",
      width: "fit-content",
      maxWidth: "95%",
      borderRadius: "9px",
      textAlign: "center",
      zIndex: 9999,
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      fontSize: ".8rem",
    },
    success: { 
        backgroundColor: "rgb(220, 255, 220)",
        color: "darkgreen"  // Changed text color for better contrast
    },
    error: { 
        backgroundColor: "rgb(255, 220, 220)",
        color: "darkred"  // Changed text color for better contrast
    },
    info: { 
        backgroundColor: "rgb(220, 220, 255)",
        color: "darkblue"  // Changed text color for better contrast
    },
  };

  return (
    <div className={animClass} style={{ ...styles.base, ...styles[popup.type] }}>
      <span> {popup.type === 'error' ? <i className="bi bi-exclamation-triangle fw-bold"></i> : popup.type === 'success' ? <i className="bi bi-check-circle fw-bold"></i> : <i className="bi bi-info-circle fw-bold"></i>}</span> &nbsp; {popup.message}
    </div>
  );
};

// Mount popup container
export function mountPopupContainer() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = createRoot(div);
  root.render(<PopupContainer />);
}

// Simple API
const popup = {
  success: (msg) => triggerPopup?.("success", msg),
  error: (msg) => triggerPopup?.("error", msg),
  info: (msg) => triggerPopup?.("info", msg),
};

export default popup;

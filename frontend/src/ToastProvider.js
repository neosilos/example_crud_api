import { createContext, useContext, useState, useRef } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    /**
     * Push a notification toast to the toast stack
     *
     * @param {string} message - message to be displayed
     * @param {("info"|"success"|"warning"|"danger")} variant - toast style variant
     * @param {number} timeout - time in milliseconds the toast will show for (use 0 to disable timeout)
     */
    function notify(message, variant = "info", timeout = 4000) {
        const id = crypto.randomUUID();

        setToasts(t => [...t, { id, message, variant, timeout }]);

        if (timeout > 0) {
            timers.current.set(id, setTimeout(() => remove(id), timeout));
        }
    }

    function remove(id) {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
        setToasts(t => t.filter(x => x.id !== id));
    }

    return (
        <ToastContext.Provider value={notify}>
            {children}
            <ToastContainer toasts={toasts} onClose={remove} />
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);

function ToastContainer({ toasts, onClose }) {
    return createPortal(
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            {toasts.map(t => (
                <div key={t.id} className={`alert alert-${t.variant} mb-2 fade show`}>
                    <div className="">
                        {t.message}
                        <button
                            className={`btn-close btn-close-${t.variant}`}
                            onClick={() => onClose(t.id)}
                        />
                    </div>
                </div>
            ))}
        </div>,
        document.body
    );
}

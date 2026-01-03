import { createPortal } from "react-dom";

/**
 * Customizable confirmation modal.
 *
 * @param {string} title - Popup title
 * @param {string} message - Popup body main message
 * @param {string} confirmText - Confirmation button's text
 * @param {function} onConfirm - Hook called when confirmation button is pressed
 * @param {function} onCancel - Hook called when confirmation is cancelled
 */
export default function ConfirmModal({
    title = "Confirm",
    message,
    confirmText = "Confirm",
    onConfirm,
    onCancel,
}) {
    return createPortal(
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor: "#00000040"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button className="btn-close" onClick={onCancel} />
                    </div>

                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}


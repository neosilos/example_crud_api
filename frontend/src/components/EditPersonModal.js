import { createPortal } from "react-dom";
import { useState } from "react";

/**
 * Modal for editing a person.
 *
 * @param {Object} person - Person to be edited
 * @param {function} onClose - Hook called when operation is cancelled
 * @param {function} onSave - Hook called when save button is clicked
 */
export default function EditPersonModal({ person, onClose, onSave }) {
    const [form, setForm] = useState(() => ({ ...person }));

    return createPortal(
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            style={{backgroundColor: "#00000040"}}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">Edit Person</h3>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">
                        <h5>Name</h5>
                        <input
                            name="name"
                            value={form.person_name}
                            onChange={e => setForm({ ...form, person_name: e.target.value})}
                            className="form-control mb-2"
                        />
                        <h5>Hobbies</h5>
                        <input
                            name="hobbies"
                            value={form.hobbies}
                            onChange={e => setForm({ ...form, hobbies: e.target.value})}
                            className="form-control"
                        />
                    </div>

                    <div className="modal-footer">
                        <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button onClick={ () => onSave(form) } className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

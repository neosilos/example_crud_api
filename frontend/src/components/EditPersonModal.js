import React from "react";
import { useState, useEffect } from "react";

function EditPersonModal({ show, person_data, onClose, onSave }) {
    const [personName, setPersonName] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (person_data) {
            setPersonName(person_data.person_name);
            setHobbies(person_data.hobbies.join(", "));
        }
    }, [person_data]);
    if (!show || !person_data)
        return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSave(
                person_data.id, {
                person_name: personName,
                hobbies: hobbies.split(",").map(hobby => hobby.trim())
            });
            onClose();
        } catch (err) {
            alert("Error updating person");
            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Person</h5>
                    </div>
                    <div className="modal-body">
                        <input className="form-control mb-2" placeholder="Person" value={personName} onChange={(e) => setPersonName(e.target.value)} />
                        <input className="form-control mb-2" placeholder="Hobbies (comma separated)" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Close</button>
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPersonModal;

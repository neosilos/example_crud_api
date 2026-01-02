export default function PersonList() {
    return (
        <div>
            <h5>Persons</h5>
            <ul class="list-group mb-3">
                <li class="list-group-item d-flex justify-content-between">
                    <span><strong>Alice</strong><br /><small>["reading","cycling"]</small></span>
                    <span>
                        <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                        <button class="btn btn-sm btn-outline-danger">Delete</button>
                    </span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                    <span><strong>Alice2</strong><br /><small>["reading2","cycling2"]</small></span>
                    <span>
                        <button class="btn btn-sm btn-outline-secondary me-2">Edit</button>
                        <button class="btn btn-sm btn-outline-danger">Delete</button>
                    </span>
                </li>
            </ul>
            <div class="d-flex justify-content-between"><button class="btn btn-secondary" disabled="">Prev</button><button class="btn btn-secondary">Next</button></div>
        </div>
    );
}

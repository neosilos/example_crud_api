export default function PersonForm() {
    return (
        <div>
            <h5>Create Person</h5>
            <input class="form-control mb-2" placeholder="Person name" />
            <input class="form-control mb-2" placeholder="Hobbies (comma separated)" />
            <button class="btn btn-primary mb-4">Create</button>
        </div>
    );
}

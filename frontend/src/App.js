import PersonList from "./components/PersonList";
import PersonForm from "./components/PersonForm";
import LongTaskPanel from "./components/LongTaskPanel";

export default function App() {
    return (
        <div className="container mt-4">
            <h3>Person CRUD Demo</h3>
            
            <PersonForm />
            <PersonList />
            <LongTaskPanel />
        </div>
    );
}

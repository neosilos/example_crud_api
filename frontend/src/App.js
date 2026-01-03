import PersonList from "./components/PersonList";
import PersonForm from "./components/PersonForm";
import LongTaskPanel from "./components/LongTaskPanel";
import { useState } from "react";

export default function App() {
    /* reloadToken allows person list to be reloaded upon person creation
       without requiring full page reload */
    const [reloadToken, setReloadToken] = useState(0);
    function triggerReload() {
        setReloadToken(t => t + 1);
    }

    return (
        <div className="container mt-4">
            <h3>Person CRUD Demo</h3>
            
            <PersonForm onPersonCreated={triggerReload} />
            <PersonList reloadToken={reloadToken} />
            <LongTaskPanel />
        </div>
    );
}

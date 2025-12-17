import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import LongTaskPanel from "./components/LongTaskPanel";

export default function App() {
  return (
    <div className="container mt-4">
      <h3>Person CRUD Demo</h3>
      <PersonForm onCreated={() => window.location.reload()} />
      <PersonList />
      <LongTaskPanel />
    </div>
  );
}

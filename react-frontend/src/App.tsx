import React from "react";
import UploadForm from "./UploadForm";
import "./App.css"; // Optional styling

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Lung Disease Classifier</h1>
      <UploadForm />
    </div>
  );
};

export default App;

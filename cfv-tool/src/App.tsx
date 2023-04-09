import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import FilePicker from './components/filepicker';
import FileEncrypter from './components/fileencrypter';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  }
  const [password, setPassword] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <div className="App">
     <h1>File Encryption</h1>
     <FilePicker accept=".txt" onFileSelect={handleFileSelect} />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      <h2>Select Password for Encrpytion:</h2>
      <input type="password" value={password} onChange={handleChange} />
      <FileEncrypter file={selectedFile} password={password}/>
    </div>
  );
}

export default App;

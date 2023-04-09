import React, { useState } from 'react';
import { decryptFile } from './utils/encryption-utils';

interface FileDecrypterProps {
  encryptedFile: File | any;
}

const FileDecrypter: React.FC<FileDecrypterProps> = ({ encryptedFile }) => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleDecryptClick = async () => {
    try {
      const decryptedFile = await decryptFile(encryptedFile, password);

      const decryptedBlob = new Blob([decryptedFile], { type: encryptedFile.type });
      const url = URL.createObjectURL(decryptedBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = encryptedFile.name.replace(/\.encrypted$/, '');
      link.download = "Decrypted-"+encryptedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  return (
    <div>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button onClick={handleDecryptClick}>Decrypt File</button>
    </div>
  );
};

export default FileDecrypter;
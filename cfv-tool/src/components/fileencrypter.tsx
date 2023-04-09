import React, { useState } from 'react';
import { encryptFile } from './utils/encryption-utils';

interface FileEncryptorProps {
  file: File | any ;
}

const FileEncryptor: React.FC<FileEncryptorProps> = ({ file }) => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEncryptClick = async () => {
    try {
      const encryptedFile = await encryptFile(file, password);
      const encryptedBlob = new Blob([encryptedFile], { type: file.type });
      const url = URL.createObjectURL(encryptedBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = "Encrypted-"+file.name + '.encrypted';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <div>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button onClick={handleEncryptClick}>Encrypt File</button>
    </div>
  );
};

export default FileEncryptor;
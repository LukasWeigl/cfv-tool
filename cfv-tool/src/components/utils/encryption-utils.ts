export async function encryptFile(file: File, password: string): Promise<ArrayBuffer> {
    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);
  
    // Generate a random 96-bit IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
  
    // Derive a 128-bit key using PBKDF2
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 100000;
    const keyLength = 128;
    const derivedKey = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', passwordBuffer),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const key = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256'
      },
      derivedKey,
      keyLength
    );
  
    // Import the key as a CryptoKey object
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM', length: 128 },
      false,
      ['encrypt']
    );
  
    // Encrypt the file using AES-GCM
    const encryptedFile = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      await file.arrayBuffer()
    );
  
    // Concatenate the salt, IV, and encrypted file buffers
    const concatenatedBuffer = concatenateBuffers(salt.buffer, iv.buffer, encryptedFile);
  
    // Return the concatenated buffer
    return concatenatedBuffer;
  }
  
  // Helper function to concatenate multiple ArrayBuffer objects
  function concatenateBuffers(...buffers: ArrayBuffer[]): ArrayBuffer {
    const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
    const concatenatedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    buffers.forEach(buffer => {
      concatenatedBuffer.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    });
    return concatenatedBuffer.buffer;
  }

  export async function decryptFile(file: File, password: string): Promise<ArrayBuffer> {
    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);
  
    // Split the concatenated buffer into its component parts
    const concatenatedBuffer = await file.arrayBuffer();
    const saltBuffer = concatenatedBuffer.slice(0, 16);
    const ivBuffer = concatenatedBuffer.slice(16, 28);
    const encryptedFileBuffer = concatenatedBuffer.slice(28);
  
    // Derive the encryption key from the password and salt
    const iterations = 100000;
    const keyLength = 128;
    const derivedKey = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', passwordBuffer),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const key = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(saltBuffer),
        iterations: iterations,
        hash: 'SHA-256'
      },
      derivedKey,
      keyLength
    );
  
    // Import the key as a CryptoKey object
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM', length: 128 },
      false,
      ['decrypt']
    );
  
    // Decrypt the file using AES-GCM
    const decryptedFile = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
      cryptoKey,
      encryptedFileBuffer
    );
  
    // Return the decrypted file as an ArrayBuffer
    return decryptedFile;
  }
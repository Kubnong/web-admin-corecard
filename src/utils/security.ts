import CryptoJS from 'crypto-js';

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  const cryptoObj = window.crypto || (window as any).msCrypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(array);
  } else {
      for (let i = 0; i < 32; i++) {
          array[i] = Math.floor(Math.random() * 256);
      }
  }
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}

export function generateCodeChallenge(verifier: string): string {
  const hash = CryptoJS.SHA256(verifier);
  
  const base64 = hash.toString(CryptoJS.enc.Base64);
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function randomString(length: number): string {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    const randomWords = CryptoJS.lib.WordArray.random(length);
    
    const hex = randomWords.toString(CryptoJS.enc.Hex);
    
    for (let i = 0; i < length; i++) {
        const hexByte = hex.substr(i * 2, 2);
        const byte = parseInt(hexByte, 16);
        result += charset[byte % charset.length];
    }
    
    return result;
}
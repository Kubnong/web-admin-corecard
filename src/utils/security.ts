// นำเข้า Library
import CryptoJS from 'crypto-js';

// 1. generateCodeVerifier (อันเดิมใช้ได้เลย ไม่ต้องแก้)
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  // ใส่ fallback เผื่อ window.crypto ไม่มี (แต่ส่วนใหญ่มี)
  const cryptoObj = window.crypto || (window as any).msCrypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(array);
  } else {
      // Fallback สำหรับ Browser โบราณมากๆ (ไม่แนะนำแต่กัน error)
      for (let i = 0; i < 32; i++) {
          array[i] = Math.floor(Math.random() * 256);
      }
  }
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}

// 2. generateCodeChallenge (✅ แก้ใหม่ใช้ CryptoJS)
// ไม่ต้องเป็น async แล้ว เพราะ crypto-js ทำงานแบบ synchronous
export function generateCodeChallenge(verifier: string): string {
  // Hash ด้วย SHA256
  const hash = CryptoJS.SHA256(verifier);
  
  // แปลงเป็น Base64
  const base64 = hash.toString(CryptoJS.enc.Base64);
  
  // แปลงเป็น Base64Url (RFC 7636)
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 3. randomString (อันเดิมใช้ได้ แต่ปรับให้ปลอดภัยขึ้นนิดนึง)
export function randomString(length: number): string {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    // ใช้ crypto-js ช่วยสุ่มก็ได้ ถ้าไม่อยากพึ่ง window.crypto
    const randomWords = CryptoJS.lib.WordArray.random(length);
    
    // แปลง WordArray เป็น Hex string ก่อนแล้วค่อย map (วิธีนี้ง่ายกว่า)
    const hex = randomWords.toString(CryptoJS.enc.Hex);
    
    for (let i = 0; i < length; i++) {
        // ดึงค่าจาก hex มาแปลงเป็น index
        const hexByte = hex.substr(i * 2, 2);
        const byte = parseInt(hexByte, 16);
        result += charset[byte % charset.length];
    }
    
    return result;
}
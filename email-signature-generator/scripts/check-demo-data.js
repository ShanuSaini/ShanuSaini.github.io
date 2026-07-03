const fs = require('fs');
const path = require('path');

const demoPath = path.join(__dirname, '..', 'js', 'demo-data.js');
const code = fs.readFileSync(demoPath, 'utf8');
const marker = 'global.EmailSignatureDemoData = ';
const start = code.indexOf(marker) + marker.length;
const end = code.lastIndexOf('};');
const jsonText = code.slice(start, end + 1);
const data = JSON.parse(jsonText);

console.log('name:', data.name);
console.log('profile mime:', data.profileImageBase64.slice(0, 30));
console.log('profile b64 length:', data.profileImageBase64.length);
console.log('logo b64 length:', data.logoBase64.length);

const profileB64 = data.profileImageBase64.split(',')[1];
const buf = Buffer.from(profileB64, 'base64');
console.log('profile decoded bytes:', buf.length, 'magic:', buf.slice(0, 4).toString('hex'));

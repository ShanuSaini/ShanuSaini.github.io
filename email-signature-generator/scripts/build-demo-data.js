const fs = require('fs');
const path = require('path');

const profilePath =
  'C:/Users/shanu/.cursor/projects/c-Users-shanu-OneDrive-Documents-Business-Course-Cursor-Playground/assets/c__Users_shanu_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_person-photo-4901344a-aba0-4b79-9b48-6619255c88aa.png';
const logoPath =
  'C:/Users/shanu/.cursor/projects/c-Users-shanu-OneDrive-Documents-Business-Course-Cursor-Playground/assets/c__Users_shanu_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_company-logo-36b87973-d104-4280-8d9c-cec58eb55e3c.png';

const profileB64 = 'data:image/jpeg;base64,' + fs.readFileSync(profilePath).toString('base64');
const logoB64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');

const demo = {
  name: 'Ethan Clarke',
  title: 'Head of Brand Strategy',
  companyName: 'Progress Partners',
  email: 'ethan.clarke@progresspartners.com',
  website: 'progresspartners.com',
  phone: '+1 (415) 728-3491',
  address: 'San Francisco, CA, USA',
  tagline: 'Your partner in progress.',
  otherInfo: 'Open to keynote speaking and brand workshops',
  linkedin: 'https://linkedin.com/in/ethanclarke',
  youtube: 'https://youtube.com/@progresspartners',
  facebook: 'https://facebook.com/progresspartners',
  instagram: 'https://instagram.com/progresspartners',
  twitter: 'https://x.com/progresspartners',
  pinterest: 'https://pinterest.com/progresspartners',
  accentColor: '#1b2a4a',
  profileImageBase64: profileB64,
  logoBase64: logoB64
};

const header = `/**
 * Sample data for local testing — optional, not loaded in production.
 *
 * Optional sample data — include before init in index.html:
 *   <script src="js/demo-data.js"></script>
 *   <script>EmailSignatureApp.init({ demo: true });</script>
 *
 * If this file is omitted or fails to load, the app starts empty for manual entry.
 */
(function (global) {
  'use strict';

  global.EmailSignatureDemoData = `;

const footer = `;
})(typeof window !== 'undefined' ? window : this);
`;

const outPath = path.join(__dirname, '..', 'js', 'demo-data.js');
fs.writeFileSync(outPath, header + JSON.stringify(demo, null, 2) + footer);
console.log('Wrote', outPath);

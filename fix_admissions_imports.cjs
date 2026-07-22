const fs = require('fs');
let file = 'src/pages/public/Admissions.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "import { ImageUpload } from '../../components/common/ImageUpload';\nimport { FileUpload } from '../../components/common/FileUpload';",
  "import { GlassImageUpload } from '../../components/common/GlassImageUpload';"
);

c = c.replace(
  "<ImageUpload value={photoUrl} onChange={setPhotoUrl} />",
  "<GlassImageUpload path=\"admissions/photos\" value={photoUrl} onChange={setPhotoUrl} />"
);

const oldUploads = `              <div className="space-y-4">
                <FileUpload label="Birth Certificate (PDF/Image)" value={birthCertificateUrl} onChange={setBirthCertificateUrl} />
                <FileUpload label="Aadhaar Card (PDF/Image)" value={aadhaarUrl} onChange={setAadhaarUrl} />
                <FileUpload label="Previous Report Card (Optional)" value={reportCardUrl} onChange={setReportCardUrl} />
              </div>`;

const newUploads = `              <div className="space-y-4">
                <GlassImageUpload label="Birth Certificate (Image)" path="admissions/birth_certs" value={birthCertificateUrl} onChange={setBirthCertificateUrl} />
                <GlassImageUpload label="Aadhaar Card (Image)" path="admissions/aadhaar" value={aadhaarUrl} onChange={setAadhaarUrl} />
                <GlassImageUpload label="Previous Report Card (Image)" path="admissions/reports" value={reportCardUrl} onChange={setReportCardUrl} />
              </div>`;

c = c.replace(oldUploads, newUploads);
fs.writeFileSync(file, c);

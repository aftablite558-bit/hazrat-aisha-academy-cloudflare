const fs = require('fs');
let file = 'src/components/home/AdmissionCTA.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ GlassCard \} from '\.\.\/common\/GlassCard';\nimport \{ GlassButton \} from '\.\.\/common\/GlassButton';\n\nexport const AdmissionCTA = \(\) => \(/, `import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';

export const AdmissionCTA = () => {
  const navigate = useNavigate();
  
  return (`);

c = c.replace(/<GlassButton variant="primary">Apply Now<\/GlassButton>\n        <GlassButton variant="glass">Contact Us<\/GlassButton>/, `<GlassButton variant="primary" onClick={() => navigate('/admissions')}>Apply Now</GlassButton>
        <GlassButton variant="glass" onClick={() => navigate('/contact')}>Contact Us</GlassButton>`);

c = c.replace(/<\/section>\n\);/, `</section>\n  );\n};`);

fs.writeFileSync(file, c);

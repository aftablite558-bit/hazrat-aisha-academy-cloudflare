import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative mt-20 transition-colors">
      <div className="glass rounded-t-[32px] border-b-0 border-x-0 shadow-none border-t border-white/30 dark:border-white/10 relative z-10 py-12 px-6 overflow-hidden">
        {/* Liquid Glass Highlights & Animation */}
        <div className="absolute inset-0 pointer-events-none -z-10 rounded-t-[32px] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-primary-500 mb-4">Hazrat Aisha Academy</h2>
            <p className="text-sm text-muted-foreground">Dilawarbagh, Sharif Colony,<br />Chak Rajopatti, Bihar – 843302</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>About Us</li>
              <li>Academics</li>
              <li>Admissions</li>
              <li>Gallery</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Contact</h3>
            <p className="text-sm text-muted-foreground">Email: Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-2">Phone: +91 9470818538</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Connect</h3>
            <div className="flex gap-4 mt-2">
              <a href="https://wa.me/919470818538" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary-500">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-12 pt-6 border-t border-slate-200/50 dark:border-white/10 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

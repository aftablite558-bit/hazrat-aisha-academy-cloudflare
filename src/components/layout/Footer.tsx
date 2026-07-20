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
            <p className="text-sm text-muted-foreground">Chak Rajopatti, Sitamarhi, Bihar.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Gallery</li>
              <li>Notice Board</li>
              <li>Downloads</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Contact</h3>
            <p className="text-sm text-muted-foreground">contact@hazrataishaacademy.com</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Powered By</h3>
            <p className="text-sm text-muted-foreground">Md Aftab</p>
            <div className="flex gap-4 mt-2">
              <a href="https://wa.me/917209666557" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary-500">
                <MessageCircle size={20} />
              </a>
              <a href="https://www.instagram.com/md__aftab557?igsh=aDRvbm5ieGNmZ2lu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary-500">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/share/1BvCwTPF1o/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary-500">
                <Facebook size={20} />
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

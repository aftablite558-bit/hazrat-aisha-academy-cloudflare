const fs = require('fs');
const path = 'src/components/layout/Navbar.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-8 flex-1 min-w-0">
            {navLinks.filter(l => ['Home', 'About', 'Academics', 'Admissions', 'Notices', 'Contact'].includes(l.label)).map((link) => (
              <NavLink key={link.path} to={link.path} className="text-sm font-semibold text-secondary-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap shrink-0">
                {link.label}
              </NavLink>
            ))}
          </div>`;

const replacement = `          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 flex-1 min-w-0">
            {navGroups.map((group) => {
              if (group.title === 'MAIN') {
                return group.links.map((link) => (
                  <NavLink key={link.path} to={link.path} className="text-sm font-semibold text-secondary-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap shrink-0">
                    {link.label}
                  </NavLink>
                ));
              }
              return (
                <div key={group.title} className="relative group/nav">
                  <button className="flex items-center gap-1 text-sm font-semibold text-secondary-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap py-4 shrink-0">
                    {group.title}
                    <ChevronDown size={14} className="group-hover/nav:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                    <div className="w-56 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xl flex flex-col gap-1">
                      {group.links.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          className={({ isActive }) =>
                            "px-4 py-2 text-sm rounded-xl transition-colors " + (
                              isActive
                                ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400'
                            )
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>`;

code = code.replace(target, replacement);

if (!code.includes('ChevronDown')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, ChevronDown } from 'lucide-react';");
}

fs.writeFileSync(path, code);
console.log('patched navbar');

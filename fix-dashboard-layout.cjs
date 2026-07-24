const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
content = content.replace(
  `  return (
    <div className="min-h-screen bg-transparent transition-colors relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="pt-24 p-4 md:p-8 lg:ml-[280px] w-full lg:w-[calc(100%-280px)] min-w-0 overflow-x-hidden">`,
  `  return (
    <div className="min-h-screen bg-transparent transition-colors">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="lg:pl-[280px] w-full min-h-screen">
        <main className="pt-24 p-4 md:p-8 w-full min-w-0 overflow-x-hidden max-w-[100vw]">`
);
content = content.replace(
  `            <ErrorBoundary><Outlet /></ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>`,
  `            <ErrorBoundary><Outlet /></ErrorBoundary>
          </motion.div>
        </AnimatePresence>
        </main>
      </div>
    </div>`
);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);

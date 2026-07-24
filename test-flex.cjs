const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
content = content.replace(
  `  return (
    <div className="min-h-screen bg-transparent transition-colors relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="pt-24 p-4 md:p-8 lg:ml-[280px] w-full lg:w-[calc(100%-280px)] min-w-0 overflow-x-hidden">`,
  `  return (
    <div className="min-h-screen bg-transparent transition-colors flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="pt-24 p-4 md:p-8 w-full flex-1 overflow-x-hidden lg:pl-[280px]">`
);
// wait, Header is fixed left-[280px], so we don't need flex for Header.

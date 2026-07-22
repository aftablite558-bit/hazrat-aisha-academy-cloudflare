function App() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4 text-center">
          Hazrat Aisha Academy ERP
        </h1>
        <p className="text-lg text-neutral-600 mb-8 text-center leading-relaxed">
          Welcome back. The system environment has been restored. 
          We are currently rebuilding the application modules following the recent cleanup.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <h3 className="font-semibold text-neutral-800 mb-2">Restoration Progress</h3>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-1/4"></div>
            </div>
            <p className="text-sm text-neutral-500 mt-2">Core environment restored</p>
          </div>
          
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <h3 className="font-semibold text-neutral-800 mb-2">Next Steps</h3>
            <ul className="text-sm text-neutral-500 list-disc list-inside space-y-1">
              <li>Restore Auth Module</li>
              <li>Rebuild Dashboard</li>
              <li>Connect Database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

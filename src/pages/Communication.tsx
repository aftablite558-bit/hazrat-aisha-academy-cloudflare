import { 
  Search, 
  Send, 
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  CheckCheck
} from 'lucide-react';

const Communication = () => {
  return (
    <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden flex h-[700px]">
      {/* Sidebar */}
      <aside className="w-80 border-r border-neutral-50 flex flex-col bg-neutral-50/30">
        <div className="p-6 border-b border-neutral-50">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { name: 'Admin (School Office)', last: 'Regarding the fees update...', time: '10:30 AM', unread: 2, online: true },
            { name: 'Class 5 Teacher', last: 'Homework submitted by Zaid', time: 'Yesterday', online: false },
            { name: 'Principal Office', last: 'Meeting scheduled for tomorrow', time: 'Mon', unread: 0, online: true },
            { name: 'Parents Association', last: 'Minutes of meeting shared', time: 'Oct 15', online: false },
          ].map((chat, i) => (
            <div key={i} className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-white transition-all border-l-4 ${i === 0 ? 'bg-white border-emerald-500' : 'border-transparent'}`}>
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-lg">
                  {chat.name.charAt(0)}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-neutral-50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 truncate">{chat.name}</h3>
                  <span className="text-[10px] text-neutral-400 font-bold">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-neutral-500 truncate">{chat.last}</p>
                  {(chat.unread ?? 0) > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="px-8 py-4 border-b border-neutral-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Admin (School Office)</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2.5 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-all">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-all">
              <Video className="h-5 w-5" />
            </button>
            <div className="w-[1px] h-6 bg-neutral-100 mx-2" />
            <button className="p-2.5 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-all">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-neutral-50/20">
          <div className="flex justify-center">
            <span className="px-4 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Today
            </span>
          </div>

          <div className="flex items-start space-x-4">
            <div className="h-8 w-8 rounded-lg bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-500">
              A
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-neutral-100 shadow-sm max-w-md">
              <p className="text-sm text-neutral-700 leading-relaxed">
                As-salamu alaykum. The academic results for Class 5 have been finalized. Please review them in the portal.
              </p>
              <span className="text-[10px] text-neutral-400 font-bold mt-2 block">10:25 AM</span>
            </div>
          </div>

          <div className="flex items-start justify-end space-x-4">
            <div className="bg-emerald-900 p-4 rounded-2xl rounded-tr-none text-white shadow-xl max-w-md">
              <p className="text-sm leading-relaxed">
                Wa alaykumu as-salam. Thank you for the update. I will check them shortly. Are the certificates ready for distribution?
              </p>
              <div className="flex items-center justify-end space-x-1 mt-2">
                <span className="text-[10px] text-emerald-300 font-bold">10:28 AM</span>
                <CheckCheck className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-700 flex items-center justify-center text-xs font-bold text-white shadow-md">
              M
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="h-8 w-8 rounded-lg bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-500">
              A
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-neutral-100 shadow-sm max-w-md">
              <p className="text-sm text-neutral-700 leading-relaxed">
                Yes, they are being printed as we speak. We should have them ready by tomorrow morning.
              </p>
              <span className="text-[10px] text-neutral-400 font-bold mt-2 block">10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-neutral-50">
          <div className="bg-neutral-50 p-2 rounded-[24px] border border-neutral-100 flex items-center space-x-2">
            <button className="p-3 text-neutral-400 hover:text-neutral-900 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3"
            />
            <button className="p-3 text-neutral-400 hover:text-neutral-900 transition-colors">
              <Smile className="h-5 w-5" />
            </button>
            <button className="bg-emerald-700 text-white p-3 rounded-2xl shadow-lg hover:bg-emerald-800 transition-all active:scale-95">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Communication;

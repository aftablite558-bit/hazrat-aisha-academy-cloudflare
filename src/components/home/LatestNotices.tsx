import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Calendar } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { Notice } from '../../types/content';

export const LatestNotices = () => {
  const { data: notices, loading } = useMasterData<Notice>('notices');
  
  const publishedNotices = notices
    .filter(n => n.isPublished)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">Latest Notices & Announcements</h2>
            <p className="text-muted-foreground text-lg">Stay updated with the latest news, circulars, and announcements from the academy.</p>
          </div>
          <Link to="/notices">
            <GlassButton variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              View All Notices <ArrowRight size={18} />
            </GlassButton>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : publishedNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedNotices.map((notice) => (
              <div key={notice.id} className="glass p-6 rounded-3xl group hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">{notice.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(notice.publishDate).toLocaleDateString()}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{notice.category}</span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">{notice.description}</p>
                {notice.attachmentUrl && (
                  <a href={notice.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
                    <GlassButton variant="glass" className="w-full flex items-center justify-center gap-2 text-sm text-primary-500 hover:bg-primary-500 hover:text-white transition-colors group">
                      <Download size={16} /> Download Attachment
                    </GlassButton>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center p-12 glass rounded-3xl">
             <p className="text-muted-foreground">No recent notices available.</p>
           </div>
        )}
      </div>
    </section>
  );
};

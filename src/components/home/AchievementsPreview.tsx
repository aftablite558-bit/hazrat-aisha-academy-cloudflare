import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { Achievement } from '../../types/content';

export const AchievementsPreview = () => {
  const { data: achievements, loading } = useMasterData<Achievement>('achievements');
  
  const publishedAchievements = achievements
    .filter(a => a.isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // top 3

  if (!loading && publishedAchievements.length === 0) return null;

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">Our Achievements</h2>
            <p className="text-muted-foreground text-lg">Celebrating the success and hard work of our students and faculty.</p>
          </div>
          <Link to="/achievements">
            <GlassButton variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              View All <ArrowRight size={18} />
            </GlassButton>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedAchievements.map((achievement) => (
              <div key={achievement.id} className="glass rounded-3xl overflow-hidden group">
                {achievement.imageUrl ? (
                  <div className="aspect-video relative overflow-hidden">
                    <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="aspect-video bg-primary-500/10 flex items-center justify-center text-primary-500">
                    <Trophy size={48} />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs font-semibold">{achievement.category}</span>
                    <span className="text-sm text-muted-foreground">{new Date(achievement.date).getFullYear()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

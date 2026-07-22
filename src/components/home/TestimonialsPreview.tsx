import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { Testimonial } from '../../types/content';

export const TestimonialsPreview = () => {
  const { data: testimonials, loading } = useMasterData<Testimonial>('testimonials');
  
  const publishedTestimonials = testimonials
    .filter(t => t.isPublished)
    .slice(0, 3); // top 3

  if (!loading && publishedTestimonials.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">What Parents Say</h2>
            <p className="text-muted-foreground text-lg">Hear from our community about their experiences with Hazrat Aisha Academy.</p>
          </div>
          <Link to="/testimonials">
            <GlassButton variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              Read All Reviews <ArrowRight size={18} />
            </GlassButton>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass p-8 rounded-3xl relative">
                <Quote className="absolute top-6 right-6 text-primary-500/10 w-16 h-16" />
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6 relative z-10 line-clamp-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  {testimonial.photoUrl ? (
                    <img src={testimonial.photoUrl} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

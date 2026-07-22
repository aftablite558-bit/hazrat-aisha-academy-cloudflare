import { GlassCard } from '../common/GlassCard';
import { motion } from 'motion/react';

const stats = [
  { label: 'Students', value: '1,200+' },
  { label: 'Teachers', value: '50+' },
  { label: 'Excellence', value: '10 Yrs' },
  { label: 'Success', value: '100%' },
];

export const Stats = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
          <GlassCard className="text-center p-8">
            <h3 className="text-4xl font-bold text-primary-500 mb-2">{stat.value}</h3>
            <p className="text-muted-foreground">{stat.label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </section>
);

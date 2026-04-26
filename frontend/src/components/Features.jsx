import { motion } from 'framer-motion';
import { HiSparkles, HiBolt, HiPaintBrush, HiCpuChip, HiAdjustmentsHorizontal, HiCloudArrowDown } from 'react-icons/hi2';
import './Features.css';

const features = [
  {
    icon: <HiSparkles />,
    title: 'AI-Powered',
    description: 'Advanced generative AI understands your design intent and creates pixel-perfect outputs.',
    color: '#7c5cfc',
  },
  {
    icon: <HiBolt />,
    title: 'Lightning Fast',
    description: 'Generate stunning designs in seconds, not hours. Iterate rapidly on your ideas.',
    color: '#f59e0b',
  },
  {
    icon: <HiPaintBrush />,
    title: 'Multiple Styles',
    description: 'Choose from modern, minimal, bold, glassmorphism and more design aesthetics.',
    color: '#ec4899',
  },
  {
    icon: <HiCpuChip />,
    title: 'Smart Layouts',
    description: 'AI automatically creates balanced, responsive layouts that follow design best practices.',
    color: '#06b6d4',
  },
  {
    icon: <HiAdjustmentsHorizontal />,
    title: 'Full Control',
    description: 'Fine-tune colors, typography, spacing and elements to match your vision exactly.',
    color: '#22c55e',
  },
  {
    icon: <HiCloudArrowDown />,
    title: 'Export Anywhere',
    description: 'Download your designs as PNG, SVG, or get the CSS code directly.',
    color: '#a78bfa',
  },
];

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="features-title">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="features-subtitle">
            Everything you need to go from idea to design in seconds
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div
                className="feature-icon"
                style={{
                  background: `${feature.color}15`,
                  color: feature.color,
                  boxShadow: `0 0 20px ${feature.color}15`,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-name">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

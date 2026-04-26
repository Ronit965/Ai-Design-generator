import { motion } from 'framer-motion';
import { HiPencilSquare, HiCpuChip, HiSparkles, HiArrowDownTray } from 'react-icons/hi2';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    icon: <HiPencilSquare />,
    title: 'Write Your Prompt',
    description: 'Describe the design you envision — include details about layout, colors, style, and purpose.',
  },
  {
    number: '02',
    icon: <HiCpuChip />,
    title: 'AI Processes',
    description: 'Our AI model analyzes your prompt and generates a design that matches your vision.',
  },
  {
    number: '03',
    icon: <HiSparkles />,
    title: 'Review & Refine',
    description: 'Preview the generated design and refine it by tweaking the prompt or adjusting style settings.',
  },
  {
    number: '04',
    icon: <HiArrowDownTray />,
    title: 'Export & Use',
    description: 'Download your design in multiple formats and use it in your projects right away.',
  },
];

const HowItWorks = () => {
  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        <motion.div
          className="how-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="how-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="how-subtitle">
            From idea to design in four simple steps
          </p>
        </motion.div>

        <div className="steps-timeline">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="step-number-wrap">
                <span className="step-number">{step.number}</span>
                {index < steps.length - 1 && <div className="step-connector" />}
              </div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

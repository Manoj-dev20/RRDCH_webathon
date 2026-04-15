import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    text: "I came from Ramanagara with a severe toothache. The doctors at RRDCH treated me so well. The staff guided me to the right department immediately.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Savitha M.",
    role: "Patient, Ramanagara"
  },
  {
    text: "My daughter's braces treatment has been excellent. Dr. Alle and the orthodontics team are very professional and patient with children.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rajesh Kumar",
    role: "Parent, Bengaluru"
  },
  {
    text: "The hospital is very clean and well-organized. We got a proper token and knew exactly when our turn was coming. Very helpful.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Lakshmi Devi",
    role: "Patient, Kumbalgodu"
  },
  {
    text: "Excellent facilities for MDS students. The clinical exposure here is far better than most dental colleges in Karnataka.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Dr. Suresh B.",
    role: "MDS Student, RRDCH"
  },
  {
    text: "The pedodontics department made my son completely comfortable. Dr. Shakuntala is wonderful with children. Highly recommended.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    name: "Meena Anand",
    role: "Parent, Mysore Road"
  },
  {
    text: "I had a root canal done here. The procedure was painless and the follow-up care was exceptional. Will definitely come back.",
    image: "https://randomuser.me/api/portraits/men/78.jpg",
    name: "Mohammed Irfan",
    role: "Patient, Bengaluru"
  },
  {
    text: "RRDCH is truly a world-class institution. The Glasgow affiliation and modern equipment show their commitment to excellence.",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    name: "Dr. Priya Nair",
    role: "Visiting Faculty"
  },
  {
    text: "Got my full dentures done here. Very affordable for the quality of care provided. The prosthodontics team was very thorough.",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    name: "Venkatesh Rao",
    role: "Patient, Kengeri"
  },
  {
    text: "Staff explained everything in Kannada which made it much easier for my elderly parents to understand their treatment plan.",
    image: "https://randomuser.me/api/portraits/women/91.jpg",
    name: "Geetha Srinivas",
    role: "Patient's Daughter"
  }
];

// Split testimonials into 3 columns
const column1 = testimonials.slice(0, 3);
const column2 = testimonials.slice(3, 6);
const column3 = testimonials.slice(6, 9);

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-border mb-4 hover:shadow-md transition-shadow">
      <Quote className="text-accent/30 mb-3" size={24} />
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        {testimonial.text}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-primary text-sm">{testimonial.name}</p>
          <p className="text-text-muted text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialColumn({ items, duration, delay = 0 }) {
  return (
    <div className="relative h-[600px] overflow-hidden testimonial-column">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: '-50%' }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          delay: delay
        }}
        className="space-y-4"
      >
        {/* Double the items for seamless loop */}
        {[...items, ...items].map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialsSection({ lang }) {
  return (
    <section className="py-16 bg-gradient-to-b from-surface to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-4">
            {lang === 'kn' ? 'ರೋಗಿಗಳ ಅಭಿಪ್ರಾಯ' : 'What Our Patients Say'}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {lang === 'kn'
              ? 'ನಮ್ಮ ರೋಗಿಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳು ನಮ್ಮ ಬಗ್ಗೆ ಏನು ಹೇಳುತ್ತಾರೆ'
              : 'Hear from our patients and students about their experience at RRDCH'}
          </p>
        </motion.div>

        {/* Testimonials Grid - 3 Columns with staggered animation speeds */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialColumn items={column1} duration={20} />
          <div className="hidden md:block">
            <TestimonialColumn items={column2} duration={25} delay={2} />
          </div>
          <div className="hidden lg:block">
            <TestimonialColumn items={column3} duration={22} delay={1} />
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-text-muted"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">50,000+</p>
            <p className="text-sm">{lang === 'kn' ? 'ಸಂತೋಷ ರೋಗಿಗಳು' : 'Happy Patients'}</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">4.8/5</p>
            <p className="text-sm">{lang === 'kn' ? 'ಸರಾಸರಿ ರೇಟಿಂಗ್' : 'Average Rating'}</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">30+</p>
            <p className="text-sm">{lang === 'kn' ? 'ವರ್ಷಗಳ ಸೇವೆ' : 'Years of Service'}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

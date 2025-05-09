'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sophie J.',
    initials: 'SJ',
    age: 28,
    text: 'Élan AI has completely transformed my wardrobe. The outfit suggestions are spot-on and I\'ve discovered my personal style without any stress!',
    rating: 5,
    location: 'New York, USA',
    bgColor: 'bg-purple-400'
  },
  {
    id: 2,
    name: 'Marcus T.',
    initials: 'MT',
    age: 34,
    text: 'As someone who struggled with fashion choices, this app is a game-changer. The virtual try-on feature saves me so much time when shopping online.',
    rating: 5,
    location: 'London, UK',
    bgColor: 'bg-blue-400'
  },
  {
    id: 3,
    name: 'Aisha K.',
    initials: 'AK',
    age: 31,
    text: 'I\'ve received more compliments on my outfits in the past month than in the entire year before using Élan AI. Worth every penny!',
    rating: 5,
    location: 'Toronto, Canada',
    bgColor: 'bg-pink-400'
  },
  {
    id: 4,
    name: 'David L.',
    initials: 'DL',
    age: 26,
    text: 'The seasonal recommendations are incredible. I used to wear the same clothes year-round, but now my style adapts perfectly with the seasons.',
    rating: 4,
    location: 'Melbourne, Australia',
    bgColor: 'bg-green-400'
  },
  {
    id: 5,
    name: 'Elena M.',
    initials: 'EM',
    age: 29,
    text: 'The AI suggestions feel so personal, like having a stylist who truly understands my preferences. I\'m constantly impressed!',
    rating: 5,
    location: 'Berlin, Germany',
    bgColor: 'bg-amber-400'
  },
  {
    id: 6,
    name: 'Jamal R.',
    initials: 'JR',
    age: 32,
    text: 'I was skeptical at first, but the style recommendations are surprisingly accurate. It\'s like the app knows me better than I know myself!',
    rating: 5,
    location: 'Dubai, UAE',
    bgColor: 'bg-indigo-400'
  }
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95
    })
  };

  const paginate = (newDirection: number) => {
    let newActive = active + newDirection;
    
    // Handle wrapping
    if (newActive < 0) {
      newActive = testimonials.length - 1;
    } else if (newActive >= testimonials.length) {
      newActive = 0;
    }
    
    setDirection(newDirection);
    setActive(newActive);
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg 
        key={index} 
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-acorn font-bold mb-4 text-primary dark:text-white">
            What Our <span className="text-gradient">Users</span> Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover how Élan AI is transforming the way people approach fashion and personal style
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Mobile view: List */}
          <div className="md:hidden space-y-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center text-white font-bold ${testimonial.bgColor}`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}, {testimonial.age}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                    <div className="flex mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>

          {/* Desktop view: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center text-white font-bold ${testimonial.bgColor}`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}, {testimonial.age}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                    <div className="flex mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile navigation */}
          <div className="flex justify-center mt-8 space-x-2 md:hidden">
            {testimonials.slice(0, 3).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${active === index ? 'w-8 bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                onClick={() => {
                  const direction = index > active ? 1 : -1;
                  setDirection(direction);
                  setActive(index);
                }}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 
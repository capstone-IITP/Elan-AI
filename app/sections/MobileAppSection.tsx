'use client';

import { motion } from 'framer-motion';

const MobileAppSection = () => {
  return (
    <section id="mobile-app" className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-acorn font-bold mb-6 text-primary dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Fashion <span className="text-gradient">on the Go</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Use Élan AI anywhere – personalized style in your pocket. Our mobile app puts the power of AI fashion styling right at your fingertips, whether you&apos;re shopping in-store or browsing from home.
            </motion.p>
            
            <motion.ul 
              className="space-y-4 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {[
                'Get outfit recommendations on the go',
                'Virtual try-on with your phone\'s camera',
                'Save and share your favorite looks',
                'Shopping list synced across all devices'
              ].map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6,13.8l0-0.1c0-0.2,0.1-0.3,0.1-0.4c0.1-0.1,0.2-0.1,0.3-0.1l0.1,0c0.4,0.2,1.3,0.6,2.3,1.1 c0.1,0.1,0.1,0.2,0,0.3c-0.9,0.5-1.7,0.9-2.2,1.1c-0.2,0.1-0.3,0-0.4-0.1c-0.1-0.2-0.2-0.3-0.3-0.5C17.5,14.8,17.5,14.3,17.6,13.8z"></path>
                    <path d="M12,6c1.8,0,3.3,0.9,4.3,2.2C15,9.5,14,11.2,14,13c0,1.9,1,3.5,2.5,4.3c-0.7,1.3-1.2,1.9-2,1.9c-0.8,0-1-0.4-2.1-0.4 s-1.4,0.4-2.1,0.4c-1.1,0-2-1.2-3-3.1C6.3,14.2,6,12.5,6,11c0-2.8,1.9-4.9,4.5-4.9C11.3,6,11.8,6.5,12,6.5z"></path>
                    <path d="M15.5,3.6c0.6,0.7,1,1.6,1,2.6c0,0.9-0.3,1.8-0.8,2.4C15,9.4,14,9.8,13,9.8c-0.1-1,0.2-1.9,0.8-2.6C14.4,6.6,15.1,6.1,15.5,3.6z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-medium">App Store</div>
                  </div>
                </button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.4160156 2.328125L12.935547 10.158203C13.132547 10.363203 13.45925 10.363203 13.65625 10.158203L15.179688 8.5742188C15.405688 8.3392188 15.354312 7.956875 15.070312 7.796875C11.137313 5.571875 6.2620156 2.811125 5.4160156 2.328125zM3.140625 2.8476562C3.055625 3.0456562 3 3.2629063 3 3.5039062L3 20.591797C3 20.788797 3.044375 20.970625 3.109375 21.140625L11.576172 12.324219C11.762172 12.128219 11.762172 11.826813 11.576172 11.632812L3.140625 2.8476562zM17.443359 9.2578125C17.335359 9.2898125 17.233531 9.3530469 17.144531 9.4355469L15.012969 11.632812C14.808969 11.836813 14.808969 12.128219 15.012969 12.332219L17.170898 14.587891C17.539898 14.970891 18.088078 14.812359 18.205078 14.318359C18.694078 12.172359 18.939922 11.047156 18.919922 10.285156C18.898922 9.3841562 18.561359 9.1758125 17.943359 9.2578125C17.779359 9.2788125 17.604609 9.2388125 17.443359 9.2578125zM13.296875 13.644531C13.165875 13.644531 13.034047 13.696328 12.935547 13.798828L5.4746094 21.566406C6.7566094 20.837406 11.328781 18.249578 15.050781 16.142578C15.334781 15.981578 15.386156 15.599281 15.160156 15.363281L13.65625 13.798828C13.55775 13.696328 13.427875 13.644531 13.296875 13.644531z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-medium">Google Play</div>
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Mobile mockups */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[600px] max-w-[300px] mx-auto">
              {/* Main phone */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[500px] bg-black rounded-[36px] p-3 z-20 shadow-2xl"
                initial={{ y: 30 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 4,
                  ease: "easeInOut" 
                }}
              >
                <div className="relative w-full h-full rounded-[28px] overflow-hidden border-4 border-black bg-gradient-to-br from-accent/20 to-primary/20">
                  <div className="flex flex-col h-full">
                    <div className="h-12 bg-accent/10 flex items-center px-4">
                      <div className="w-6 h-6 rounded-full bg-accent/20 mr-2"></div>
                      <div className="h-4 w-24 bg-accent/20 rounded"></div>
                    </div>
                    <div className="flex-grow p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/30 h-32 rounded-lg"></div>
                        <div className="bg-white/30 h-32 rounded-lg"></div>
                        <div className="bg-white/30 h-32 rounded-lg"></div>
                        <div className="bg-white/30 h-32 rounded-lg"></div>
                      </div>
                      <div className="h-8 bg-white/30 rounded-full mt-4 w-3/4 mx-auto"></div>
                    </div>
                    <div className="h-16 bg-black/5 flex justify-around items-center px-4">
                      <div className="w-6 h-6 rounded-full bg-accent/20"></div>
                      <div className="w-6 h-6 rounded-full bg-accent/20"></div>
                      <div className="w-6 h-6 rounded-full bg-accent/20"></div>
                      <div className="w-6 h-6 rounded-full bg-accent/20"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[14px] left-1/2 transform -translate-x-1/2 w-[80px] h-[20px] bg-black rounded-b-[14px] z-10"></div>
              </motion.div>
              
              {/* Second phone */}
              <motion.div 
                className="absolute top-[100px] -left-[60px] w-[200px] h-[400px] bg-gray-900 rounded-[30px] p-2 z-10 shadow-xl transform rotate-[-10deg]"
                initial={{ x: -50, rotate: -15 }}
                animate={{ x: [-40, -60, -40], rotate: [-8, -12, -8] }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="relative w-full h-full rounded-[24px] overflow-hidden border-2 border-gray-800 bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                  <div className="flex flex-col h-full">
                    <div className="h-10 bg-blue-400/10 flex items-center px-3">
                      <div className="w-5 h-5 rounded-full bg-blue-400/20 mr-2"></div>
                      <div className="h-3 w-20 bg-blue-400/20 rounded"></div>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-blue-400/20 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-blue-400/30"></div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-4 bg-white/20 rounded-full w-full mb-2"></div>
                      <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Third phone */}
              <motion.div 
                className="absolute top-[60px] -right-[40px] w-[180px] h-[360px] bg-accent rounded-[26px] p-2 z-0 shadow-lg transform rotate-[12deg]"
                initial={{ x: 40, rotate: 15 }}
                animate={{ x: [30, 50, 30], rotate: [10, 14, 10] }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 4.5,
                  ease: "easeInOut",
                  delay: 0.75
                }}
              >
                <div className="relative w-full h-full rounded-[22px] overflow-hidden border-2 border-accent/80 bg-gradient-to-br from-pink-500/30 to-purple-500/30">
                  <div className="flex flex-col h-full">
                    <div className="h-8 bg-pink-400/10 flex items-center px-3">
                      <div className="w-4 h-4 rounded-full bg-pink-400/20 mr-2"></div>
                      <div className="h-2 w-16 bg-pink-400/20 rounded"></div>
                    </div>
                    <div className="p-3">
                      <div className="h-20 bg-white/20 rounded-lg mb-3"></div>
                      <div className="h-20 bg-white/20 rounded-lg mb-3"></div>
                      <div className="h-20 bg-white/20 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection; 
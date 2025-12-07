import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { ArrowRight, Activity, Shield, Video, Calendar, Clock, BarChart } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { Card, CardContent } from '../components/ui/card';

const Landing = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar /> 
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* Abstract Background Blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-[100%] blur-3xl -z-10 pointer-events-none" />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl space-y-8 z-10"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
             <span className="px-4 py-1.5 rounded-full bg-white border border-black/5 shadow-sm text-gray-600 text-sm font-medium flex items-center gap-2 dark:bg-white/10 dark:text-gray-300 dark:border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                New Generation Telemedicine
             </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
            Healthcare, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white">
              simplified.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Connect with certified doctors instantly. Secure video consultations, smart scheduling, and premium care from the comfort of your home.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="white" size="lg" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-24 px-4 md:px-8 bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Everything you need for better health</h2>
                <p className="text-xl text-muted-foreground">Premium tools for doctors and patients, unified in one platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[minmax(180px,auto)]">
                {/* Large Card Left */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 md:row-span-2"
                >
                    <Card className="h-full bg-white dark:bg-gray-900 border-black/5 dark:border-white/10 shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                        <CardContent className="p-8 h-full flex flex-col justify-between relative">
                            <div className="z-10 relative">
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl w-fit">
                                    <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">HD Video Consultations</h3>
                                <p className="text-lg text-muted-foreground max-w-md">Experience crystal clear, secure video calls with your doctor. Built with WebRTC for low latency and high reliability.</p>
                            </div>
                            
                            {/* Abstract decorative graphic */}
                            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-tl from-blue-50 to-transparent dark:from-blue-900/20 rounded-tl-[100px] opacity-50 group-hover:scale-105 transition-transform duration-500" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Small Card Top Right */}
                <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                >
                     <Card className="h-full bg-white dark:bg-gray-900 border-black/5 dark:border-white/10 shadow-soft hover:shadow-medium transition-all group">
                        <CardContent className="p-8">
                            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl w-fit">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                            <p className="text-muted-foreground">End-to-end encryption for all your health data.</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Small Card Bottom Right */}
                <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.3 }}
                >
                     <Card className="h-full bg-white dark:bg-gray-900 border-black/5 dark:border-white/10 shadow-soft hover:shadow-medium transition-all group">
                        <CardContent className="p-8">
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl w-fit">
                                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                            <p className="text-muted-foreground">Book appointments in seconds with smart scheduling.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.4 }}
                >
                    <Card className="h-full bg-white dark:bg-gray-900 border-black/5 dark:border-white/10 shadow-soft hover:shadow-medium transition-all flex flex-col md:flex-row items-center overflow-hidden">
                         <div className="p-8 flex-1">
                            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl w-fit">
                                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Real-time Vitals</h3>
                            <p className="text-muted-foreground">Track your health metrics and share them with your doctor instantly.</p>
                         </div>
                         <div className="w-full md:w-1/3 h-48 bg-orange-50/50 dark:bg-orange-900/10 flex items-center justify-center">
                            <Activity className="h-24 w-24 text-orange-200" />
                         </div>
                    </Card>
                 </motion.div>

                 <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.5 }}
                >
                    <Card className="h-full bg-white dark:bg-gray-900 border-black/5 dark:border-white/10 shadow-soft hover:shadow-medium transition-all flex flex-col md:flex-row items-center overflow-hidden">
                         <div className="p-8 flex-1 order-2 md:order-1">
                            <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl w-fit">
                                <BarChart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Doctor Insights</h3>
                            <p className="text-muted-foreground">Powerful dashboards for doctors to manage patients and prescriptions.</p>
                         </div>
                         <div className="w-full md:w-1/3 h-48 bg-pink-50/50 dark:bg-pink-900/10 flex items-center justify-center md:order-2">
                             <BarChart className="h-24 w-24 text-pink-200" />
                         </div>
                    </Card>
                 </motion.div>
            </div>
        </div>
      </section>

      {/* Medicine Marquee Section */}
      <section className="py-12 border-y border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden">
         <div className="flex gap-16 animate-marquee whitespace-nowrap">
             {[...Array(2)].map((_, i) => (
                 <div key={i} className="flex gap-16 items-center">
                    {["Amoxicillin", "Lisinopril", "Metformin", "Atorvastatin", "Levothyroxine", "Amlodipine", "Metoprolol", "Omeprazole", "Losartan", "Gabapentin"].map((med, index) => (
                        <span key={index} className="text-2xl font-semibold text-muted-foreground/40 uppercase tracking-widest hover:text-primary/60 transition-colors">
                            {med}
                        </span>
                    ))}
                 </div>
             ))}
         </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
             <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">Trusted by thousands</h2>
                <p className="text-xl text-muted-foreground">See what patients and doctors are saying about DOXY.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        name: "Sarah Johnson",
                        role: "Patient",
                        quote: "DOXY changed how I manage my family's health. The video quality is amazing and booking is so fast.",
                        initial: "S",
                        color: "bg-blue-100 text-blue-600"
                    },
                    {
                        name: "Dr. Michael Chen",
                        role: "Cardiologist",
                        quote: "The patient dashboard gives me real-time vitals that practically save lives. It's the future of practice.",
                        initial: "M",
                        color: "bg-purple-100 text-purple-600"
                    },
                    {
                        name: "Emma Davis",
                        role: "Patient",
                        quote: "I love the prescription management. No more lost papers, everything is just there on my phone.",
                        initial: "E",
                        color: "bg-green-100 text-green-600"
                    }
                ].map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                         <Card className="h-full bg-white dark:bg-gray-900 border-black/5 dark:border-white/10 shadow-soft hover:shadow-medium transition-all">
                             <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`h-12 w-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-lg`}>
                                        {testimonial.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-lg text-muted-foreground/80 leading-relaxed">"{testimonial.quote}"</p>
                             </CardContent>
                         </Card>
                    </motion.div>
                ))}
             </div>
          </div>
      </section>
      
      {/* Footer Simple */}
      <footer className="py-20 px-4 md:px-8 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1 space-y-4">
                <Link to="/" className="font-bold text-xl block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        DOXY
                    </span>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Reimagining healthcare delivery with secure, instant, and premium telemedicine solutions.
                </p>
                <div className="flex gap-4 pt-2">
                    {/* Social Placeholders */}
                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer">
                        <span className="sr-only">Twitter</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer">
                        <span className="sr-only">GitHub</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <h4 className="font-semibold text-sm">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="hover:text-primary transition-colors cursor-pointer">Features</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Team</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Enterprise</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="hover:text-primary transition-colors cursor-pointer">About</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Blog</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Careers</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Contact</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</li>
                </ul>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground pt-8 border-t border-black/5 dark:border-white/5">
            <p>© 2025 DOXY Healthcare Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>All systems operational</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

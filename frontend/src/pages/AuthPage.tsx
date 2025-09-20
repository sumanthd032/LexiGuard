// frontend/src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getFriendlyAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email': return 'That email looks invalid. Please check and try again.';
      case 'auth/user-not-found': return 'No account found with this email. Try signing up instead.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use': return 'An account with this email already exists. Try signing in.';
      case 'auth/weak-password': return 'Password must be at least 6 characters long.';
      default: return 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      setError("Please enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        navigate('/dashboard');
    } catch (err: any) {
        setError(getFriendlyAuthError(err));
    } finally {
        setLoading(false);
    }
  };
  
  const formVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeInOut" } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="relative w-full max-w-4xl h-[600px] grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl">
            {/* --- Left Branding Panel --- */}
            <div className="hidden md:flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-brand-green to-teal-500 text-white rounded-l-2xl">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    <ShieldCheckIcon className="h-20 w-20" />
                </motion.div>
                <h1 className="mt-6 text-3xl font-bold font-display">Welcome to LexiGuard</h1>
                <p className="mt-4 text-teal-100">Your personal contract guardian. Gain clarity and confidence in every document you sign.</p>
            </div>

            {/* --- Right Form Panel --- */}
            <div className="relative flex flex-col justify-center p-8 sm:p-12 bg-white rounded-2xl md:rounded-l-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? "login" : "signup"}
                        variants={formVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                    >
                        <div className="text-left mb-8">
                            <h2 className="text-3xl font-extrabold text-brand-blue font-display">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            </h2>
                            <p className="text-brand-text mt-2">
                                {isLogin ? "Welcome back! Please enter your details." : "Let's get you started."}
                            </p>
                        </div>

                        {/* --- FORM --- */}
                        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green" />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative">
                                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green" />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Error Display */}
                            <AnimatePresence>
                                {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                                </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-400 transition-all duration-300 transform hover:-translate-y-1">
                                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {/* --- Divider & Social Login --- */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
                            </div>
                            <div className="mt-6">
                                <button onClick={handleGoogleSignIn} disabled={loading}
                                    className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-600 hover:bg-gray-50 disabled:bg-gray-200 transition-all">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    <span className="ml-3">Sign in with Google</span>
                                </button>
                            </div>
                        </div>

                        {/* Toggle Link */}
                        <div className="text-sm text-center mt-6">
                            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-medium text-brand-green hover:text-opacity-80">
                                {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
};

export default AuthPage;
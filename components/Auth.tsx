import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { MicrosoftIcon } from './icons/MicrosoftIcon';
import { LogoIcon } from './icons/LogoIcon';

interface AuthProps {
  onLogin: (isNewUser: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to switch modes and clear fields
  const switchMode = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to sign up.');
        }
        onLogin(true); // isNewUser = true
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      try {
          const response = await fetch('/api/auth/signin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.message || 'Failed to sign in.');
          }
          onLogin(false); // isNewUser = false
      } catch (err: any) {
          setError(err.message);
      } finally {
        setIsLoading(false);
      }
  };

  const handleSimulatedAuth = (isNewUser: boolean) => {
    // This remains for OAuth and Skip buttons
    onLogin(isNewUser);
  };

  const renderSignIn = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand-gray-300">Email</label>
        <input 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full mt-1 p-3 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100 focus:ring-2 focus:ring-brand-blue" />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-gray-300">Password</label>
        <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full mt-1 p-3 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100 focus:ring-2 focus:ring-brand-blue" />
      </div>
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-brand-gray-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );

  const renderSignUp = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand-gray-300">Full Name</label>
        <input 
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full mt-1 p-3 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100 focus:ring-2 focus:ring-brand-blue" />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-gray-300">Email</label>
        <input 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full mt-1 p-3 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100 focus:ring-2 focus:ring-brand-blue" />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-gray-300">Password</label>
        <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full mt-1 p-3 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100 focus:ring-2 focus:ring-brand-blue" />
      </div>
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-brand-gray-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );

  return (
    <div className="bg-brand-gray-800 p-8 rounded-xl shadow-lg border border-brand-gray-700 w-full max-w-md">
      <LogoIcon className="h-16 w-16 text-brand-blue mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-2 text-center">Aapda Mitra</h2>
      <p className="text-brand-gray-400 mb-6 text-center">Your companion in times of crisis.</p>

      <div className="flex border-b border-brand-gray-600 mb-6">
        <button 
          onClick={() => switchMode('signin')}
          className={`flex-1 py-3 font-semibold ${authMode === 'signin' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-brand-gray-400'}`}
        >
          Sign In
        </button>
        <button 
          onClick={() => switchMode('signup')}
          className={`flex-1 py-3 font-semibold ${authMode === 'signup' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-brand-gray-400'}`}
        >
          Sign Up
        </button>
      </div>
      
      {error && <div className="mb-4 text-center p-3 bg-red-900/40 text-red-300 border border-red-500 rounded-lg">{error}</div>}

      {authMode === 'signin' ? renderSignIn() : renderSignUp()}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-brand-gray-800 text-brand-gray-500">OR</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleSimulatedAuth(false)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-gray-700 text-brand-gray-200 font-semibold rounded-lg shadow-md hover:bg-brand-gray-600 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          onClick={() => handleSimulatedAuth(false)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-gray-700 text-brand-gray-200 font-semibold rounded-lg shadow-md hover:bg-brand-gray-600 transition-colors"
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => handleSimulatedAuth(false)}
          className="text-sm text-brand-gray-400 hover:text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded"
        >
          Skip for now
        </button>
      </div>

    </div>
  );
};

export default Auth;
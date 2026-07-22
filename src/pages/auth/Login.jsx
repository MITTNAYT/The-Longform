import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signIn, selectAuthStatus, selectAuthError } from '../../store/authSlice';
import Icon from '../../components/AppIcon';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const resultAction = await dispatch(signIn({ email, password }));
    if (signIn.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel — visible md+ */}
      <div className="hidden md:flex md:w-[42%] lg:w-[45%] relative overflow-hidden bg-primary flex-col justify-between p-10 lg:p-14 flex-shrink-0">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, #C8A870 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8B5A2B 0%, transparent 50%)`
          }}
        />
        {/* Floating dots */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-accent/60 animate-float-dot" />
        <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 rounded-full bg-accent/50 animate-float-dot" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-accent/40 animate-float-dot" style={{ animationDelay: '2s' }} />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Icon name="Moon" size={16} className="text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-primary-foreground tracking-tight">
            The Longform<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="font-heading text-2xl lg:text-3xl font-bold text-primary-foreground/90 italic leading-snug mb-5">
            "In the quiet hours, the truest thoughts find their voice."
          </blockquote>
          <p className="text-sm text-primary-foreground/50">— The Longform</p>
        </div>

        {/* Reader count */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['A','B','C'].map((l, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-primary bg-primary-foreground/10 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-primary-foreground/60">
            Join <strong className="text-primary-foreground/80">2,847</strong> readers
          </p>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-10 lg:px-16">
        {/* Mobile logo */}
        <Link to="/" className="md:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="Moon" size={14} className="text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">
            The Longform<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Error */}
          {authError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200/80 text-sm text-red-700">
              <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-pro"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-foreground/80 uppercase tracking-wide">
                  Password
                </label>
                <a href="#" className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-pro pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={authStatus === 'loading'}
              className="btn-primary w-full mt-2 justify-center !rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authStatus === 'loading' ? (
                <>
                  <Icon name="RefreshCw" size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-ornament my-6 text-xs text-muted-foreground/50 font-medium">
            <span className="px-3">or continue with</span>
          </div>

          {/* Social auth placeholder */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border/70 text-sm font-medium text-foreground hover:bg-muted/40 hover:border-accent/30 transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.28a3.66 3.66 0 01-1.59 2.4v2h2.57c1.5-1.38 2.42-3.42 2.42-5.86z" fill="#4285F4"/>
              <path d="M8 16c2.16 0 3.97-.71 5.3-1.94l-2.57-2a5.02 5.02 0 01-2.73.76 5 5 0 01-4.7-3.46H.64v2.07A8 8 0 008 16z" fill="#34A853"/>
              <path d="M3.3 9.36A5.03 5.03 0 013.04 8c0-.47.08-.93.2-1.36V4.57H.64a8 8 0 000 6.86l2.66-2.07z" fill="#FBBC05"/>
              <path d="M8 3.18c1.22 0 2.31.42 3.17 1.24l2.37-2.37A8 8 0 00.64 4.57L3.3 6.64A5 5 0 018 3.18z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { Outlet } from 'react-router-dom';
import { LogoWithText } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand text-brand-foreground">
        <div className="flex flex-col justify-center items-center p-12 text-center">
          <LogoWithText size="lg" className="text-brand-foreground mb-8" />
          <h1 className="text-4xl font-bold mb-4">
            Land more interviews with AI-optimized resumes
          </h1>
          <p className="text-xl text-brand-foreground/80 max-w-md">
            Join thousands of job seekers who've upgraded their applications with ApplyPro AI
          </p>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 lg:p-6">
          <div className="lg:hidden">
            <LogoWithText />
          </div>
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
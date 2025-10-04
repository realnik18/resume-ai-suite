import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';

// Layouts - Keep these immediate as they're used by all routes
import MarketingLayout from '@/components/layouts/marketing-layout';
import AppLayout from '@/components/layouts/app-layout';
import AuthLayout from '@/components/layouts/auth-layout';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/home'));
const PricingPage = lazy(() => import('@/pages/pricing'));
const AboutPage = lazy(() => import('@/pages/about'));
const ContactPage = lazy(() => import('@/pages/contact'));
const HelpCenterPage = lazy(() => import('@/pages/help-center'));
const ChangelogPage = lazy(() => import('@/pages/changelog'));
const PrivacyPage = lazy(() => import('@/pages/legal/privacy'));
const TermsPage = lazy(() => import('@/pages/legal/terms'));

const SignInPage = lazy(() => import('@/pages/auth/sign-in'));
const SignUpPage = lazy(() => import('@/pages/auth/sign-up'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password'));

const AppOverviewPage = lazy(() => import('@/pages/app/overview'));
const ResumesPage = lazy(() => import('@/pages/app/resumes'));
const ResumeEditorPage = lazy(() => import('@/pages/app/resumes/[id]'));
const CoverLettersPage = lazy(() => import('@/pages/app/cover-letters'));
const TrackerPage = lazy(() => import('@/pages/app/tracker'));
const AnalyticsPage = lazy(() => import('@/pages/app/analytics'));
const SettingsPage = lazy(() => import('@/pages/app/settings'));

const AdminUsersPage = lazy(() => import('@/pages/admin/users'));
const AdminMetricsPage = lazy(() => import('@/pages/admin/metrics'));

import Loading from '@/components/loading';

// Route Guard Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading message="Checking authentication..." />;
  }
  
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading message="Checking permissions..." />;
  }
  
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  // For now, all authenticated users have admin access
  // TODO: Implement proper role-based access control
  return <>{children}</>;
}

export const router = createBrowserRouter([
  // Marketing Routes
  {
    path: '/',
    element: <MarketingLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<Loading />}><PricingPage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<Loading />}><AboutPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<Loading />}><ContactPage /></Suspense> },
      { path: 'help-center', element: <Suspense fallback={<Loading />}><HelpCenterPage /></Suspense> },
      { path: 'changelog', element: <Suspense fallback={<Loading />}><ChangelogPage /></Suspense> },
      { path: 'legal/privacy', element: <Suspense fallback={<Loading />}><PrivacyPage /></Suspense> },
      { path: 'legal/terms', element: <Suspense fallback={<Loading />}><TermsPage /></Suspense> },
    ],
  },
  
  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <Suspense fallback={<Loading />}><SignInPage /></Suspense> },
      { path: 'sign-up', element: <Suspense fallback={<Loading />}><SignUpPage /></Suspense> },
      { path: 'reset-password', element: <Suspense fallback={<Loading />}><ResetPasswordPage /></Suspense> },
    ],
  },
  
  // App Routes (Protected)
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/overview" replace /> },
      { path: 'overview', element: <Suspense fallback={<Loading />}><AppOverviewPage /></Suspense> },
      { path: 'resumes', element: <Suspense fallback={<Loading />}><ResumesPage /></Suspense> },
      { path: 'resumes/:id', element: <Suspense fallback={<Loading />}><ResumeEditorPage /></Suspense> },
      { path: 'cover-letters', element: <Suspense fallback={<Loading />}><CoverLettersPage /></Suspense> },
      { path: 'tracker', element: <Suspense fallback={<Loading />}><TrackerPage /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<Loading />}><AnalyticsPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Loading />}><SettingsPage /></Suspense> },
    ],
  },
  
  // Admin Routes (Protected + Admin)
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AppLayout isAdmin />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/users" replace /> },
      { path: 'users', element: <Suspense fallback={<Loading />}><AdminUsersPage /></Suspense> },
      { path: 'metrics', element: <Suspense fallback={<Loading />}><AdminMetricsPage /></Suspense> },
    ],
  },
  
  // 404 - Catch all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
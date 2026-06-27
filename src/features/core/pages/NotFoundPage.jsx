import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, SearchX } from 'lucide-react';

export default function NotFoundPage({ admin = false }) {
  const location = useLocation();
  const homePath = admin ? '/admin' : '/';
  const shopPath = admin ? '/admin/orders' : '/shop';

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
          <SearchX className="w-8 h-8" />
        </div>

        <p className="text-xs font-bold text-primary uppercase tracking-[0.24em] mb-3">
          404
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary">
          Page Not Found
        </h1>
        <p className="text-sm md:text-base text-text-muted mt-4 leading-relaxed">
          We could not find <span className="font-medium text-text-primary">{location.pathname}</span>. It may have moved, been removed, or the link may be incorrect.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={homePath}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors"
          >
            <Home className="w-4 h-4" />
            {admin ? 'Admin Home' : 'Go Home'}
          </Link>
          <Link
            to={shopPath}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-border text-text-primary font-medium rounded-full hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {admin ? 'View Orders' : 'Back to Shop'}
          </Link>
        </div>
      </div>
    </div>
  );
}

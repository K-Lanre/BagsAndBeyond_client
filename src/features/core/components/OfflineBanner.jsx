import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-[60] bg-text-primary text-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs font-medium">
        <WifiOff className="w-4 h-4" />
        <span>Offline mode. Checkout, payment, and order tracking need internet.</span>
      </div>
    </div>
  );
}

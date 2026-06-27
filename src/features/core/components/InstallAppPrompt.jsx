import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'bagsandbeyond_install_prompt_dismissed';

export function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY) === 'true';

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setIsVisible(!dismissed);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible || !installEvent) return null;

  return (
    <div className="fixed left-4 right-4 bottom-20 md:left-auto md:right-6 md:bottom-6 md:w-80 z-[70] bg-surface border border-border shadow-2xl rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text-primary">Install BagsAndBeyond</p>
          <p className="text-xs text-text-muted mt-1">Add the shop to your device for a faster app-like experience.</p>
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            Install
          </button>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="p-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

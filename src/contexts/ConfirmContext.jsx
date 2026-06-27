import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ConfirmContext = createContext(null);

const defaultOptions = {
  title: 'Confirm Action',
  message: 'Are you sure you want to continue?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger'
};

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const [isResolving, setIsResolving] = useState(false);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        ...defaultOptions,
        ...options,
        resolve
      });
    });
  }, []);

  const close = useCallback((result) => {
    if (!dialog) return;
    setIsResolving(true);
    dialog.resolve(result);
    setDialog(null);
    setIsResolving(false);
  }, [dialog]);

  const value = useMemo(() => ({ confirm }), [confirm]);
  const isDanger = dialog?.variant === 'danger';

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => close(false)}
          />

          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDanger ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-primary/10 text-primary'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-serif font-bold text-text-primary">
                  {dialog.title}
                </h2>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {dialog.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => close(false)}
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => close(false)}
                className="px-5 py-2.5 border border-border text-text-primary font-medium rounded-full hover:bg-secondary transition-colors"
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                disabled={isResolving}
                className={`px-5 py-2.5 text-white font-medium rounded-full transition-colors disabled:opacity-70 flex items-center justify-center gap-2 ${
                  isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                {isResolving && <Loader2 className="w-4 h-4 animate-spin" />}
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used inside ConfirmProvider');
  }
  return context.confirm;
}

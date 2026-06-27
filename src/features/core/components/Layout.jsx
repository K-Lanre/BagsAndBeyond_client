/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/core/components/Layout.jsx */
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { InstallAppPrompt } from './InstallAppPrompt';
import { OfflineBanner } from './OfflineBanner';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      <OfflineBanner />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <InstallAppPrompt />
    </div>
  );
}

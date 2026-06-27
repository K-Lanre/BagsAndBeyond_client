/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/home/pages/HomePage.jsx */
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { Categories } from '../components/Categories';
import { NewArrivals } from '../components/NewArrivals';
import { Benefits } from '../components/Benefits';
import { OrderTrackingCTA } from '../components/OrderTrackingCTA';
import { PromoBanner } from '../components/PromoBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-background transition-colors duration-300">
      <PromoBanner />
      <Hero />
      <TrustStrip />
      <Categories />
      <NewArrivals />
      <Benefits />
      <OrderTrackingCTA />
    </div>
  );
}

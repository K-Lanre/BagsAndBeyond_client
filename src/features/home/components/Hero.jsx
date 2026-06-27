/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/home/components/Hero.jsx */
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 md:pr-10 z-10">
            <span className="text-primary text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300">
              CURATED LUXURY
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-text-primary leading-tight">
              Bags & Shoes <br /> That Define You
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-sm leading-relaxed">
              Domestic and international delivery for pieces that bridge
              classic craftsmanship with modern everyday style.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                to="/shop"
                className="inline-flex justify-center items-center px-10 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Shop The Collection
              </Link>
              <Link
                to="/shop/bags"
                className="inline-flex justify-center items-center px-10 py-4 bg-secondary text-primary font-medium rounded-full hover:bg-primary/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Shop Bags
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <img
              src="/landing/hero1.png"
              alt="Bags and Beyond Hero"
              className="w-full h-auto max-h-[600px] object-contain transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/home/components/Categories.jsx */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Categories() {
  const [activeShoeImage, setActiveShoeImage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShoeImage((prev) => (prev === 1 ? 2 : 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-10 md:mb-16">
          Shop By Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
          {/* Bags Category */}
          <Link
            to="/shop/bags"
            className="group relative w-full h-[300px] md:h-[450px] bg-surface border border-border rounded-[2rem] overflow-hidden flex items-end block transition-transform duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            {/* Category Image */}
            <div className="absolute inset-0">
              <img
                src="/landing/Bags Collection.png"
                alt="Bags Category"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="relative z-20 p-8 md:p-12 w-full">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">
                Bags
              </h3>
              <span className="inline-flex items-center text-white/90 text-sm font-medium tracking-wide group-hover:text-primary transition-colors">
                Explore{" "}
                <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Shoes Category */}
          <Link
            to="/shop/shoes"
            className="group relative w-full h-[300px] md:h-[450px] md:mt-12 bg-surface border border-border rounded-[2rem] overflow-hidden flex items-end block transition-transform duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            {/* Image Carousel */}
            <div className="absolute inset-0 bg-secondary/10 dark:bg-black/20 overflow-hidden">
              {/* First Image */}
              <img
                src="/landing/Shoes Collection.png"
                alt="Shoes Category 1"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  activeShoeImage === 1 ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Second Image */}
              <img
                src="/landing/female.jfif"
                alt="Shoes Category 2"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  activeShoeImage === 2 ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="relative z-20 p-8 md:p-12 w-full">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">
                Shoes
              </h3>
              <span className="inline-flex items-center text-white/90 text-sm font-medium tracking-wide group-hover:text-primary transition-colors">
                Explore{" "}
                <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

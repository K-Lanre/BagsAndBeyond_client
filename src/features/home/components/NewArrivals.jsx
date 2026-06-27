import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Loader2 } from 'lucide-react';
import { ShopProductCard } from '../../shop/components/ShopProductCard';
import { useProducts } from '../../../hooks/useProducts';

import 'swiper/css';
import 'swiper/css/pagination';

export function NewArrivals() {
  const { data, isLoading, isError } = useProducts({
    page: 1,
    limit: 12,
    sort: 'newest'
  });

  const products = (data?.products || [])
    .filter((product) => product.status !== 'inactive' && product.status !== 'out_of_stock' && Number(product.stock_quantity || 0) > 0)
    .slice(0, 8);

  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <span className="text-primary text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase mb-2 block">
              SEASONAL DROP
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-text-primary">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors hidden sm:flex items-center gap-2"
          >
            View All Collection <span>&gt;</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-72">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted">
            New arrivals are unavailable right now.
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted">
            No new arrivals yet.
          </div>
        ) : (
          <div className="new-arrivals-swiper -mx-4 px-4 sm:mx-0 sm:px-0">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1.25}
              loop={products.length > 4}
              autoplay={products.length > 4 ? {
                delay: 3500,
                disableOnInteraction: false,
              } : false}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 28,
                },
              }}
              className="pb-12"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ShopProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="mt-8 sm:hidden flex justify-center">
          <Link
            to="/shop"
            className="text-primary text-sm font-semibold hover:text-primary-hover transition-colors"
          >
            View All Collection &gt;
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .new-arrivals-swiper .swiper-pagination-bullet-active {
          background: var(--primary) !important;
        }
        .new-arrivals-swiper .swiper-pagination {
          bottom: 0px !important;
        }
      `}} />
    </section>
  );
}

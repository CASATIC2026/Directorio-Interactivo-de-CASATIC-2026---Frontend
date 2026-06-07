import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Link } from 'react-router-dom';
import '@splidejs/react-splide/css';

export default function LogoSlider({ title, subtitle, items, perPage = 5 }) {
  return (
    <section className="py-10 bg-white rounded-2xl shadow-lg">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {title}
        </h2>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-surface-600 mb-6">
            {subtitle}
          </p>
        )}

        {/* Slider */}
        <Splide
          options={{
            type: 'loop',
            perPage: perPage,
            autoplay: true,
            interval: 2000,
            speed: 800,
            pauseOnHover: true,
            pauseOnFocus: false,
            arrows: false,
            pagination: false,
            gap: '2rem',
            lazyLoad: 'nearby',
            breakpoints: {
              1280: { perPage: 4 },
              1024: { perPage: 3 },
              768: { perPage: 2 },
              480: { perPage: 2 },
            },
          }}
        >
          {items.map((item, index) => {
            const isExternal = item.link?.startsWith("http");

            const img = (
              <img
                src={item.img}
                alt="logo"
                loading="lazy"
                className="h-[80px] w-auto object-contain mx-auto hover:scale-105 transition duration-300"
              />
            );

            return (
              <SplideSlide key={index}>
                {isExternal ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center h-[140px]"
                  >
                    {img}
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className="flex justify-center items-center h-[140px]"
                  >
                    {img}
                  </Link>
                )}
              </SplideSlide>
            );
          })}
        </Splide>

      </div>
    </section>
  );
}
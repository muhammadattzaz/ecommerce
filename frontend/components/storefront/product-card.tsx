import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatPrice, getDiscount, getImageUrl, cn } from '@/lib/utils';

export interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  className?: string;
}

export function ProductCard({
  name,
  slug,
  price,
  originalPrice,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  className,
}: ProductCardProps) {
  const discount = originalPrice ? getDiscount(price, originalPrice) : 0;
  const stars = Math.min(5, Math.max(0, Math.round(rating)));
  const imgSrc = getImageUrl(imageUrl);

  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        'sf-card block bg-white border border-[#E8E8E8] rounded-[4px] overflow-hidden',
        className,
      )}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-[#F5F5F5]">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <svg viewBox="0 0 80 80" className="w-14 h-14">
              <rect x="10" y="15" width="60" height="50" rx="4" fill="#E8E8E8" />
              <circle cx="27" cy="31" r="5" fill="#CCCCCC" />
              <path d="M10 50 L30 35 L45 48 L55 40 L70 50 L70 65 L10 65 Z" fill="#CCCCCC" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 pb-2.5 pt-2">
        {/* Name — 2-line clamp */}
        <p
          className="text-[13px] leading-snug mb-1.5"
          style={{
            color: 'var(--color-text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            minHeight: '36px',
          }}
        >
          {name}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className="text-[14px] font-bold"
            style={{ color: 'var(--color-price)', fontVariantNumeric: 'tabular-nums' }}
          >
            {formatPrice(price)}
          </span>
          {discount > 0 && originalPrice && (
            <>
              <span
                className="text-[11px] text-gray-400 line-through"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatPrice(originalPrice)}
              </span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--color-price)' }}>
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Star rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={10}
                  fill={s <= stars ? '#FFBB00' : 'none'}
                  stroke={s <= stars ? '#FFBB00' : '#CCCCCC'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-[11px] text-gray-400">
                ({reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

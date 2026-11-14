"use client";

import { useState } from "react";
import { Star, StarHalf, ThumbsUp, Flag, User, Calendar, MoreVertical } from "lucide-react";

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  images?: string[];
  isLiked?: boolean;
  isPurchased?: boolean;
}
const fakeReviews: Review[] = [
  {
    id: "1",
    user: {
      name: "سارا محمدی",
      isVerified: true,
    },
    rating: 5,
    title: "عالی بود!",
    content: "واقعاً راضی هستم. کیفیت محصول عالی بود و زودتر از زمان مقرر به دستم رسید. بسته‌بندی بسیار زیبا و شکیل بود. حتماً دوباره خرید خواهم کرد.",
    date: "۱۴۰۳/۱۲/۱۵",
    likes: 24,
    isPurchased: true,
  },
  {
    id: "2",
    user: {
      name: "مریم احمدی",
    },
    rating: 4,
    title: "خوبه اما...",
    content: "کیفیت خوبی داره ولی قیمتش یه کمی بالاست. کاش تخفیف بیشتری می‌دادن. در کل راضی هستم.",
    date: "۱۴۰۳/۱۲/۱۰",
    likes: 12,
    isPurchased: true,
  },
  {
    id: "3",
    user: {
      name: "نازنین کریمی",
      isVerified: true,
    },
    rating: 5,
    title: "محصول عالی و با کیفیت",
    content: "واقعاً عالی بود! دوست دخترم خیلی خوشحال شد. مرسی از فروشگاه خوبتون. حتماً به دوستانم هم پیشنهاد میدم.",
    date: "۱۴۰۳/۱۲/۰۵",
    likes: 8,
    isPurchased: true,
  },
  {
    id: "4",
    user: {
      name: "زهرا رضایی",
    },
    rating: 3,
    title: "معمولی بود",
    content: "به نظر من اونطور که انتظار داشتم نبود. شاید انتظارم زیادی بالا بود. ولی در کل بد نیست.",
    date: "۱۴۰۳/۱۱/۲۸",
    likes: 3,
    isPurchased: false,
  },
  {
    id: "5",
    user: {
      name: "فاطمه حسینی",
      isVerified: true,
    },
    rating: 5,
    title: "بهترین خریدی که داشتم",
    content: "واقعاً نمیدونستم اینقدر خوب باشه! عکس‌ها کم fromش میدادن. چند بار استفاده کردم و واقعاً راضیم.",
    date: "۱۴۰۳/۱۱/۲۰",
    likes: 45,
    isPurchased: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [liked, setLiked] = useState(review.isLiked || false);
  const [likesCount, setLikesCount] = useState(review.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
            {review.user.name.charAt(0)}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{review.user.name}</span>
              {review.user.isVerified && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  خرید تأیید شده
                </span>
              )}
              {review.isPurchased && !review.user.isVerified && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  خریدار محصول
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} />
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {review.date}
              </span>
            </div>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <h4 className="font-bold text-gray-800 mb-2">{review.title}</h4>
      <p className="text-gray-600 leading-relaxed text-sm mb-3">{review.content}</p>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition-colors ${
            liked ? "text-pink-600" : "text-gray-400 hover:text-pink-600"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likesCount}</span>
        </button>
        
        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <Flag className="w-4 h-4" />
          <span>گزارش</span>
        </button>
      </div>
    </div>
  );
}

export default function ReviewsSection({ productReviewCount = 34, productRating = 4.5 }: { productReviewCount?: number; productRating?: number }) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [showWriteReview, setShowWriteReview] = useState(false);

  const sortedReviews = [...fakeReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const ratingStats = {
    5: fakeReviews.filter(r => r.rating === 5).length,
    4: fakeReviews.filter(r => r.rating === 4).length,
    3: fakeReviews.filter(r => r.rating === 3).length,
    2: fakeReviews.filter(r => r.rating === 2).length,
    1: fakeReviews.filter(r => r.rating === 1).length,
  };

  const totalReviews = fakeReviews.length;

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-pink-50 to-rose-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-right">
            <div className="text-5xl font-bold text-pink-600">{productRating}</div>
            <div className="flex justify-center md:justify-start mt-2">
              <StarRating rating={productRating} />
            </div>
            <div className="text-gray-500 mt-1">
              میانگین امتیاز از {productReviewCount} نظر
            </div>
            
            <button
              onClick={() => setShowWriteReview(true)}
              className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors text-sm"
            >
              + نوشتن نظر جدید
            </button>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingStats[star as keyof typeof ratingStats];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{star} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="font-bold text-lg text-gray-800">
          نظرات کاربران ({totalReviews})
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">مرتب‌سازی:</span>
          <select
            value={sortBy}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink-400"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="highest">بیشترین امتیاز</option>
            <option value="lowest">کمترین امتیاز</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {showWriteReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWriteReview(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">نوشتن نظر جدید</h3>
              <button onClick={() => setShowWriteReview(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">امتیاز شما</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors">
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان نظر</label>
                <input
                  type="text"
                  placeholder="مثلاً عالی بود..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">متن نظر</label>
                <textarea
                  rows={4}
                  placeholder="نظر خود را بنویسید..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-400 resize-none"
                />
              </div>
              
              <button className="w-full py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors">
                ثبت نظر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
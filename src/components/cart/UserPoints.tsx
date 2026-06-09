// components/cart/UserPoints.tsx
"use client";

import { useState, useEffect } from "react";
import { Star, Gift, TrendingUp, Award } from "lucide-react";

interface UserPointsProps {
  currentPoints?: number;
  nextLevelPoints?: number;
  discountPercent?: number;
  onRedeemPoints?: (points: number) => void;
}

export default function UserPoints({
  currentPoints = 220,
  nextLevelPoints = 500,
  discountPercent = 5,
  onRedeemPoints,
}: UserPointsProps) {
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [showRedeem, setShowRedeem] = useState(false);

  const progress = (currentPoints / nextLevelPoints) * 100;
  const remainingPoints = nextLevelPoints - currentPoints;

  // محاسبه تخفیف قابل دریافت
  const availableDiscount = Math.floor(currentPoints / 100) * discountPercent;
  const maxDiscount = Math.min(availableDiscount, 30); // حداکثر 30% تخفیف

  const handleRedeem = () => {
    if (onRedeemPoints && selectedPoints > 0) {
      onRedeemPoints(selectedPoints);
      setShowRedeem(false);
      setSelectedPoints(0);
    }
  };

  return (
    <div
      className="bg-linear-to-r from-pink-200 to-pink-100 rounded-4xl p-6  shadow-lg"
      style={{
        backgroundImage: "url('/images/bg_point3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6" />
          <h3 className="font-bold text-lg">امتیاز شما</h3>
        </div>
        <button
          onClick={() => setShowRedeem(!showRedeem)}
          className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors"
        >
          {showRedeem ? "بستن" : "تبدیل امتیاز"}
        </button>
      </div>

      {/* امتیاز فعلی */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-pink-500">
          {currentPoints.toLocaleString()}
        </div>
        {/* <p className="text-white/80 text-sm">امتیاز شما</p> */}
      </div>

      {/* نوار پیشرفت */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{currentPoints.toLocaleString()} امتیاز</span>
          <span>{nextLevelPoints.toLocaleString()} امتیاز</span>
        </div>
        <div className="w-full bg-pink-100/70 rounded-full h-2 overflow-hidden">
          <div
            className="bg-pink-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs mt-2 text-center">
          {remainingPoints > 0
            ? `${remainingPoints} امتیاز تا سطح بعدی`
            : "تبریک! به سطح بعدی رسیدید"}
        </p>
      </div>

      {/* مزایا */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/10 rounded-xl p-2 text-center">
          <Star className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs font-semibold">
            {Math.floor(currentPoints / 100)}%
          </p>
          <p className="text-[10px] ">تخفیف قابل دریافت</p>
        </div>
        <div className="bg-white/10 rounded-xl p-2 text-center">
          <Gift className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs font-semibold">
            {Math.floor(currentPoints / 50)}
          </p>
          <p className="text-[10px] ">هدیه قابل دریافت</p>
        </div>
        <div className="bg-white/10 rounded-xl p-2 text-center">
          <TrendingUp className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs font-semibold">VIP</p>
          <p className="text-[10px] ">سطح {Math.floor(progress / 25) + 1}</p>
        </div>
      </div>

      {/* پنل تبدیل امتیاز */}
      {showRedeem && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-2 animate-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-medium mb-3">تبدیل امتیاز به تخفیف</p>

          {/* اسلایدر انتخاب امتیاز */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={Math.min(currentPoints, 1000)}
              step={100}
              value={selectedPoints}
              onChange={(e) => setSelectedPoints(Number(e.target.value))}
              className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>0</span>
              <span>{Math.min(currentPoints, 1000)} امتیاز</span>
            </div>
          </div>

          {/* نمایش تخفیف */}
          <div className="bg-white/10 rounded-lg p-3 mb-3 text-center">
            <p className="text-sm">تخفیف قابل دریافت</p>
            <p className="text-2xl font-bold text-pink-400">
              {Math.floor(selectedPoints / 100)}%
            </p>
            <p className="text-xs text-black/70">
              معادل{" "}
              {Math.floor((selectedPoints / 100) * 10000).toLocaleString()}{" "}
              تومان
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRedeem}
              disabled={selectedPoints === 0}
              className="flex-1 bg-pink-400 text-gray-800 py-2 rounded-full text-sm font-semibold hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تبدیل امتیاز
            </button>
            <button
              onClick={() => setSelectedPoints(0)}
              className="px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              ریست
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function numberToPersianWords(num: number | string | null | undefined) {
  if (!num) return "";

  const parsed = Number(String(num).replace(/,/g, ""));

  if (parsed === 0) return "صفر";

  const ones = [
    "",
    "یک",
    "دو",
    "سه",
    "چهار",
    "پنج",
    "شش",
    "هفت",
    "هشت",
    "نه",
  ];

  const teens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];

  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];

  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];

  const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  const convertThreeDigits = (number: number) => {
    const result = [];

    const hundred = Math.floor(number / 100);
    const remainder = number % 100;

    if (hundred) result.push(hundreds[hundred]);

    if (remainder >= 10 && remainder < 20) {
      result.push(teens[remainder - 10]);
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;

      if (ten >= 2) result.push(tens[ten]);
      if (one) result.push(ones[one]);
    }

    return result.join(" و ");
  };

  const result = [];
  let scaleIndex = 0;
  let remainingNum = parsed;

  while (remainingNum > 0) {
    const group = remainingNum % 1000;

    if (group) {
      const text = convertThreeDigits(group);
      result.unshift(
        scales[scaleIndex] ? `${text} ${scales[scaleIndex]}` : text,
      );
    }

    remainingNum = Math.floor(remainingNum / 1000);
    scaleIndex++;
  }

  return result.join(" و ");
}

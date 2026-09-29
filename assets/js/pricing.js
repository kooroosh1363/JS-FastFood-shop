export const PRICING_RULES = Object.freeze({
  taxBasisPoints: 850,
  deliveryFeeCents: 499,
  freeDeliveryThresholdCents: 3000,
  lunchPromoCode: "LUNCH10",
  lunchPromoPercent: 10,
  lunchPromoMinimumCents: 2000,
  lunchPromoMaxDiscountCents: 500
});

function roundBasisPoints(amountCents, basisPoints) {
  return Math.round((amountCents * basisPoints) / 10000);
}

export function calculatePricing(state, menuItems, rules = PRICING_RULES) {
  const itemMap = new Map((Array.isArray(menuItems) ? menuItems : []).map((item) => [item.id, item]));

  const lines = Object.entries(state?.cart || {})
    .map(([id, quantity]) => {
      const item = itemMap.get(id);
      const safeQuantity = Math.max(0, Math.trunc(Number(quantity) || 0));
      if (!item || safeQuantity === 0) return null;

      return {
        id,
        name: item.name,
        quantity: safeQuantity,
        unitPriceCents: item.priceCents,
        lineTotalCents: item.priceCents * safeQuantity
      };
    })
    .filter(Boolean);

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);

  const promoEligible =
    String(state?.promoCode || "").trim().toUpperCase() === rules.lunchPromoCode &&
    subtotalCents >= rules.lunchPromoMinimumCents;

  const rawDiscount = promoEligible
    ? Math.round((subtotalCents * rules.lunchPromoPercent) / 100)
    : 0;

  const discountCents = Math.min(rawDiscount, rules.lunchPromoMaxDiscountCents);
  const discountedSubtotalCents = Math.max(0, subtotalCents - discountCents);

  const deliveryFeeCents =
    state?.orderType === "delivery" &&
    discountedSubtotalCents > 0 &&
    discountedSubtotalCents < rules.freeDeliveryThresholdCents
      ? rules.deliveryFeeCents
      : 0;

  const taxCents = roundBasisPoints(discountedSubtotalCents, rules.taxBasisPoints);
  const totalCents = discountedSubtotalCents + deliveryFeeCents + taxCents;

  return {
    lines,
    subtotalCents,
    promoEligible,
    discountCents,
    deliveryFeeCents,
    taxCents,
    totalCents
  };
}

export function formatMoney(cents) {
  const safe = Number.isFinite(Number(cents)) ? Number(cents) : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(safe / 100);
}

export function createOrderState() {
  return {
    cart: {},
    orderType: "pickup",
    promoCode: ""
  };
}

export function normalizeOrderState(value) {
  const source = value && typeof value === "object" ? value : {};
  const cart = {};

  if (source.cart && typeof source.cart === "object") {
    for (const [id, rawQuantity] of Object.entries(source.cart)) {
      const quantity = Math.max(0, Math.min(99, Math.trunc(Number(rawQuantity) || 0)));
      if (quantity > 0) cart[id] = quantity;
    }
  }

  return {
    cart,
    orderType: source.orderType === "delivery" ? "delivery" : "pickup",
    promoCode: typeof source.promoCode === "string" ? source.promoCode.trim().toUpperCase().slice(0, 24) : ""
  };
}

export function addItem(state, id, quantity = 1) {
  const next = normalizeOrderState(state);
  const amount = Math.max(1, Math.min(99, Math.trunc(Number(quantity) || 1)));

  return {
    ...next,
    cart: {
      ...next.cart,
      [id]: Math.min(99, (next.cart[id] || 0) + amount)
    }
  };
}

export function setItemQuantity(state, id, quantity) {
  const next = normalizeOrderState(state);
  const amount = Math.max(0, Math.min(99, Math.trunc(Number(quantity) || 0)));
  const cart = { ...next.cart };

  if (amount === 0) delete cart[id];
  else cart[id] = amount;

  return { ...next, cart };
}

export function removeItem(state, id) {
  return setItemQuantity(state, id, 0);
}

export function setOrderType(state, orderType) {
  const next = normalizeOrderState(state);
  return { ...next, orderType: orderType === "delivery" ? "delivery" : "pickup" };
}

export function setPromoCode(state, promoCode) {
  const next = normalizeOrderState(state);
  return {
    ...next,
    promoCode: String(promoCode || "").trim().toUpperCase().slice(0, 24)
  };
}

export function cartCount(state) {
  return Object.values(normalizeOrderState(state).cart)
    .reduce((sum, quantity) => sum + quantity, 0);
}

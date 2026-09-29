import test from "node:test";
import assert from "node:assert/strict";
import { filterMenu, menuItems } from "../assets/js/menu-data.js";
import {
  addItem,
  cartCount,
  createOrderState,
  removeItem,
  setItemQuantity,
  setOrderType,
  setPromoCode
} from "../assets/js/order-store.js";
import { calculatePricing, PRICING_RULES } from "../assets/js/pricing.js";
import { loadOrder, saveOrder } from "../assets/js/persistence.js";

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value)
  };
}

test("cart state supports add quantity update and removal", () => {
  let state=createOrderState();
  state=addItem(state,"classic-doner",2);
  assert.equal(cartCount(state),2);

  state=setItemQuantity(state,"classic-doner",3);
  assert.equal(cartCount(state),3);

  state=removeItem(state,"classic-doner");
  assert.equal(cartCount(state),0);
});

test("menu filtering combines category and search", () => {
  assert.equal(filterMenu(menuItems,{category:"Doner",query:"spicy"}).length,1);
  assert.equal(filterMenu(menuItems,{category:"Drinks",query:"cola"})[0].id,"cola");
});

test("pickup pricing applies tax without delivery fee", () => {
  let state=createOrderState();
  state=addItem(state,"classic-doner",2);

  const pricing=calculatePricing(state,menuItems);

  assert.equal(pricing.subtotalCents,2380);
  assert.equal(pricing.deliveryFeeCents,0);
  assert.equal(pricing.taxCents,202);
  assert.equal(pricing.totalCents,2582);
});

test("delivery fee applies below free-delivery threshold", () => {
  let state=createOrderState();
  state=addItem(state,"classic-doner",1);
  state=setOrderType(state,"delivery");

  const pricing=calculatePricing(state,menuItems);
  assert.equal(pricing.deliveryFeeCents,PRICING_RULES.deliveryFeeCents);
});

test("LUNCH10 applies only above the minimum and respects cap", () => {
  let state=createOrderState();
  state=addItem(state,"double-doner",4);
  state=setPromoCode(state,"lunch10");

  const pricing=calculatePricing(state,menuItems);

  assert.equal(pricing.promoEligible,true);
  assert.equal(pricing.discountCents,PRICING_RULES.lunchPromoMaxDiscountCents);
});

test("order persistence round-trips normalized state", () => {
  const storage=memoryStorage();
  let state=createOrderState();
  state=addItem(state,"cola",2);
  state=setOrderType(state,"delivery");
  state=setPromoCode(state,"lunch10");

  assert.equal(saveOrder(state,storage),true);
  assert.deepEqual(loadOrder(storage),state);
});

test("corrupted storage safely falls back to an empty order", () => {
  const storage=memoryStorage();
  storage.setItem("biteflow:order:v1","{broken");

  assert.deepEqual(loadOrder(storage),createOrderState());
});

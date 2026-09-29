import { categories, filterMenu, menuItemById, menuItems } from "./menu-data.js";
import {
  addItem,
  cartCount,
  createOrderState,
  removeItem,
  setItemQuantity,
  setOrderType,
  setPromoCode
} from "./order-store.js";
import { calculatePricing, formatMoney } from "./pricing.js";
import { loadOrder, saveOrder } from "./persistence.js";

let order = loadOrder() ?? createOrderState();
let category = "All";
let query = "";

const $ = (selector) => document.querySelector(selector);
const menuGrid = $("[data-menu-grid]");
const categoryBar = $("[data-categories]");
const cartItems = $("[data-cart-items]");
const cartCountNode = $("[data-cart-count]");
const subtotalNode = $("[data-subtotal]");
const discountNode = $("[data-discount]");
const deliveryNode = $("[data-delivery]");
const taxNode = $("[data-tax]");
const totalNode = $("[data-total]");
const resultCountNode = $("[data-result-count]");
const cartDrawer = $("[data-cart-drawer]");
const cartBackdrop = $("[data-cart-backdrop]");
const promoInput = $("[data-promo]");
const orderTypeSelect = $("[data-order-type]");
const statusRegion = $("[data-status]");
const searchInput = $("[data-search]");
const checkoutButton = $("[data-checkout]");

function announce(message) {
  statusRegion.textContent = "";
  requestAnimationFrame(() => {
    statusRegion.textContent = message;
  });
}

function persistAndRender(message = "") {
  saveOrder(order);
  render();
  if (message) announce(message);
}

function productCard(item) {
  const article = document.createElement("article");
  article.className = "menu-card";
  article.innerHTML = `
    <div class="menu-card__media">
      <img src="${item.image}" alt="" width="420" height="320" loading="lazy">
    </div>
    <div class="menu-card__body">
      <div class="menu-card__meta">
        <span>${item.category}</span>
        <span>${item.tags[0]}</span>
      </div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-card__footer">
        <strong>${formatMoney(item.priceCents)}</strong>
        <button type="button" data-add="${item.id}">Add to order</button>
      </div>
    </div>
  `;
  return article;
}

function renderMenu() {
  const visible = filterMenu(menuItems, { category, query });
  menuGrid.replaceChildren(...visible.map(productCard));
  resultCountNode.textContent = `${visible.length} item${visible.length === 1 ? "" : "s"}`;

  [...categoryBar.querySelectorAll("button")].forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderCategories() {
  categoryBar.replaceChildren();
  categories.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.category = item;
    button.textContent = item;
    button.setAttribute("aria-pressed", String(item === category));
    if (item === category) button.classList.add("is-active");
    button.addEventListener("click", () => {
      category = item;
      renderMenu();
    });
    categoryBar.append(button);
  });
}

function renderCart() {
  const pricing = calculatePricing(order, menuItems);
  cartCountNode.textContent = String(cartCount(order));
  cartItems.replaceChildren();

  if (!pricing.lines.length) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = "Your order is empty.";
    cartItems.append(empty);
  } else {
    pricing.lines.forEach((line) => {
      const item = menuItemById(line.id);
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <img src="${item.image}" alt="" width="64" height="64">
        <div class="cart-row__copy">
          <strong>${line.name}</strong>
          <span>${formatMoney(line.unitPriceCents)} each</span>
        </div>
        <label>
          <span class="sr-only">Quantity for ${line.name}</span>
          <input type="number" min="0" max="99" value="${line.quantity}" data-quantity="${line.id}">
        </label>
        <button type="button" data-remove="${line.id}" aria-label="Remove ${line.name}">Remove</button>
      `;
      cartItems.append(row);
    });
  }

  subtotalNode.textContent = formatMoney(pricing.subtotalCents);
  discountNode.textContent = pricing.discountCents ? `−${formatMoney(pricing.discountCents)}` : formatMoney(0);
  deliveryNode.textContent = pricing.deliveryFeeCents ? formatMoney(pricing.deliveryFeeCents) : "Free";
  taxNode.textContent = formatMoney(pricing.taxCents);
  totalNode.textContent = formatMoney(pricing.totalCents);
  checkoutButton.disabled = pricing.lines.length === 0;
  orderTypeSelect.value = order.orderType;
  promoInput.value = order.promoCode;
}

function render() {
  renderMenu();
  renderCart();
}

function setCartOpen(open) {
  cartDrawer.hidden = !open;
  cartBackdrop.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
  $("[data-cart-toggle]").setAttribute("aria-expanded", String(open));
  if (open) cartDrawer.querySelector("button, input, select")?.focus();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.matches("[data-add]")) {
    order = addItem(order, button.dataset.add);
    persistAndRender("Item added to order.");
    setCartOpen(true);
  }

  if (button.matches("[data-remove]")) {
    order = removeItem(order, button.dataset.remove);
    persistAndRender("Item removed.");
  }

  if (button.matches("[data-cart-toggle]")) setCartOpen(true);
  if (button.matches("[data-cart-close]")) setCartOpen(false);
});

cartItems.addEventListener("change", (event) => {
  if (!event.target.matches("[data-quantity]")) return;
  order = setItemQuantity(order, event.target.dataset.quantity, event.target.value);
  persistAndRender("Quantity updated.");
});

searchInput.addEventListener("input", () => {
  query = searchInput.value;
  renderMenu();
});

orderTypeSelect.addEventListener("change", () => {
  order = setOrderType(order, orderTypeSelect.value);
  persistAndRender("Order type updated.");
});

promoInput.addEventListener("change", () => {
  order = setPromoCode(order, promoInput.value);
  persistAndRender(order.promoCode ? "Promo code applied if eligible." : "Promo code cleared.");
});

checkoutButton.addEventListener("click", () => {
  announce("Demo checkout only. No payment or order submission is performed.");
});

cartBackdrop.addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setCartOpen(false);
});

renderCategories();
render();

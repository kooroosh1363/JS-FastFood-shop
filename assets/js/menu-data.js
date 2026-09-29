export const menuItems = Object.freeze([
  {
    id: "classic-doner",
    name: "Classic Doner",
    category: "Doner",
    priceCents: 1190,
    image: "./assets/images/New folder/donar_1-removebg-preview.png",
    description: "Roasted doner, crisp greens, tomato, onion, and house yogurt sauce.",
    tags: ["popular", "beef"]
  },
  {
    id: "chili-doner",
    name: "Chili Doner",
    category: "Doner",
    priceCents: 1250,
    image: "./assets/images/New folder/donar_3-removebg-preview.png",
    description: "Doner with chili relish, pickled onion, herbs, and smoky sauce.",
    tags: ["spicy", "beef"]
  },
  {
    id: "garden-doner",
    name: "Garden Doner",
    category: "Doner",
    priceCents: 1090,
    image: "./assets/images/New folder/doanr_2-removebg-preview.png",
    description: "Grilled vegetables, greens, herbs, and tahini-style sauce.",
    tags: ["vegetarian", "fresh"]
  },
  {
    id: "double-doner",
    name: "Double Doner",
    category: "Doner",
    priceCents: 1490,
    image: "./assets/images/New folder/donar_4-removebg-preview.png",
    description: "Double doner portion with cabbage, tomato, onion, and garlic sauce.",
    tags: ["protein", "beef"]
  },
  {
    id: "citrus-cooler",
    name: "Citrus Cooler",
    category: "Drinks",
    priceCents: 450,
    image: "./assets/images/coctail.png",
    description: "Cold citrus drink with mint and sparkling water.",
    tags: ["cold", "alcohol-free"]
  },
  {
    id: "cola",
    name: "Cola",
    category: "Drinks",
    priceCents: 350,
    image: "./assets/images/coke.png",
    description: "Chilled cola served as a simple menu add-on.",
    tags: ["cold", "classic"]
  }
]);

export const categories = Object.freeze(["All", "Doner", "Drinks"]);

export function menuItemById(id) {
  return menuItems.find((item) => item.id === id) ?? null;
}

export function filterMenu(items, { category = "All", query = "" } = {}) {
  const term = String(query || "").trim().toLowerCase();

  return (Array.isArray(items) ? items : []).filter((item) => {
    const categoryMatch = category === "All" || item.category === category;
    const haystack = [
      item.name,
      item.category,
      item.description,
      ...(item.tags || [])
    ].join(" ").toLowerCase();

    return categoryMatch && (!term || haystack.includes(term));
  });
}

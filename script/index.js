// api endpoints
const API = {
  categories: "https://openapi.programming-hero.com/api/categories",
  plants: "https://openapi.programming-hero.com/api/plants",
  category: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
  plant: (id) => `https://openapi.programming-hero.com/api/plant/${id}`,
};

// dom elements
const categoriesEl = document.getElementById("categories");
const cardsGrid = document.getElementById("cardsGrid");
const spinner = document.getElementById("spinner");
const cartList = document.getElementById("cartList");
const totalPriceEl = document.getElementById("totalPrice");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
// cart
let cart = [];

// helper functions
function setLoading(on) {
  spinner.style.display = on ? "flex" : "none";
}

function formatBDT(n) {
  return "৳ " + Number(n).toFixed(0);
}

function scrollToEl(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// load categories
async function loadCategories() {
  try {
    setLoading(true);
    const res = await fetch(API.categories);
    const json = await res.json();
    const cats = json?.data ?? json?.categories ?? [];
    renderCategories(cats);
  } catch (err) {
    console.error("Failed to load categories", err);
    categoriesEl.innerHTML =
      '<p class="text-sm text-red-600">Failed to load categories.</p>';
  } finally {
    setLoading(false);
  }
}

function renderCategories(list) {
  categoriesEl.innerHTML = "";

  // all Trees button
  const allBtn = document.createElement("button");
  allBtn.textContent = "All Trees";
  allBtn.className = "w-full text-left p-2 rounded border category-btn active";
  allBtn.dataset.catId = "";
  allBtn.addEventListener("click", () => {
    setActiveCategory("");
    loadPlants();
  });
  categoriesEl.appendChild(allBtn);
  // other categories
  list.forEach((cat) => {
    const id = cat.id ?? cat.category_id ?? "";
    const name = cat.name ?? cat.category_name ?? `Category ${id}`;
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.className = "w-full text-left p-2 rounded border category-btn";
    btn.dataset.catId = id;
    btn.addEventListener("click", () => {
      setActiveCategory(id);
      loadPlantsByCategory(id);
    });
    categoriesEl.appendChild(btn);
  });
}

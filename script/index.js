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
// active category
function setActiveCategory(id) {
  document
    .querySelectorAll(".category-btn")
    .forEach((b) => b.classList.remove("active"));
  const btn =
    id === ""
      ? document.querySelector(".category-btn")
      : document.querySelector(`[data-cat-id="${id}"]`);
  if (btn) btn.classList.add("active");
}

// load plants
async function loadPlants() {
  try {
    setLoading(true);
    const res = await fetch(API.plants);
    const json = await res.json();
    const plants = json?.data ?? json?.plants ?? [];
    renderPlants(plants.slice(0, 12));
  } catch (err) {
    console.error(err);
    cardsGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-500">Failed to load plants.</p>';
  } finally {
    setLoading(false);
  }
}

async function loadPlantsByCategory(id) {
  if (!id) return loadPlants();
  try {
    setLoading(true);
    const res = await fetch(API.category(id));
    const json = await res.json();

    const plants = json?.data?.plants ?? json?.data ?? json?.plants ?? [];
    renderPlants(plants.slice(0, 12));
  } catch (err) {
    console.error(err);
    cardsGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-500">Failed to load category plants.</p>';
  } finally {
    setLoading(false);
  }
}

// plant cards
function renderPlants(items) {
  cardsGrid.innerHTML = "";
  if (!items || items.length === 0) {
    cardsGrid.innerHTML =
      '<p class="col-span-full text-center text-gray-500">No plants found.</p>';
    return;
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow";

    // image
    const imgWrap = document.createElement("div");
    imgWrap.className =
      "card-img-placeholder mb-3 min-h-[150px] bg-gray-100 rounded";
    const imgUrl = item.image ?? item.img ?? "./assets/placeholder.png";
    imgWrap.style.backgroundImage = `url('${imgUrl}')`;
    imgWrap.style.backgroundSize = "cover";
    imgWrap.style.backgroundPosition = "center";

    // name
    const name = document.createElement("h4");
    name.className = "font-semibold text-lg cursor-pointer hover:underline";
    const displayName = item.name ?? item.plant_name ?? "Unknown";
    name.textContent = displayName;
    const plantId = item.id ?? item._id ?? item.plant_id ?? "";
    name.addEventListener("click", () => openModalWithPlant(plantId, item));

    // description
    const desc = document.createElement("p");
    desc.className = "text-sm text-gray-600 mt-2";
    const short =
      item.description ?? item.short_description ?? "A lovely plant.";
    desc.textContent = short.length > 120 ? short.slice(0, 120) + "..." : short;

    // category price
    const meta = document.createElement("div");
    meta.className = "flex items-center justify-between mt-3 gap-2";
    const cat = document.createElement("span");
    cat.className = "text-xs px-2 py-1 border rounded text-green-700";
    cat.textContent = item.category ?? item.category_name ?? "—";

    const price = document.createElement("span");
    price.className = "font-semibold";
    const p = item.price ?? item.price_in_usd ?? item.cost ?? 500;
    price.textContent = formatBDT(p);

    meta.appendChild(cat);
    meta.appendChild(price);

    // add to cart
    const addBtn = document.createElement("button");
    addBtn.className = "mt-4 w-full bg-green-700 text-white py-2 rounded";
    addBtn.textContent = "Add to Cart";
    addBtn.addEventListener("click", () =>
      addToCart({ id: plantId, name: displayName, price: Number(p) })
    );

    // append
    card.appendChild(imgWrap);
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(meta);
    card.appendChild(addBtn);

    cardsGrid.appendChild(card);
  });
}
// modal function
async function openModalWithPlant(id, fallback) {
  modalContent.innerHTML = '<div class="p-6">Loading...</div>';
  modal.classList.remove("hidden");

  if (!id) return renderModalContent(fallback ?? {});

  try {
    const res = await fetch(API.plant(id));
    const json = await res.json();
    const plant = json?.data ?? fallback ?? {};
    renderModalContent(plant);
  } catch (err) {
    console.error(err);
    renderModalContent(
      fallback ?? { name: "Unknown", description: "No details available." }
    );
  }
}

function renderModalContent(plant) {
  const name = plant.name ?? plant.plant_name ?? "Plant";
  const img = plant.image ?? "./assets/placeholder.png";
  const desc = plant.description ?? plant.details ?? "No details available.";
  const category = plant.category ?? plant.category_name ?? "—";
  const price = plant.price ?? plant.cost ?? 500;

  modalContent.innerHTML = `
    <h3 class="text-xl font-semibold">${name}</h3>
    <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="min-h-[180px] bg-gray-100 rounded" style="background-image: url('${img}'); background-size:cover; background-position:center"></div>
      <div>
        <p class="text-sm text-gray-700">${desc}</p>
        <p class="mt-3"><strong>Category:</strong> ${category}</p>
        <p class="mt-1"><strong>Price:</strong> ${formatBDT(price)}</p>
      </div>
    </div>
  `;
}

modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// cart function
function addToCart(item) {
  const existing = cart.find((c) => c.id === item.id);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push({ ...item, qty: 1 });
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = '<li class="text-gray-500">Cart is empty</li>';
    totalPriceEl.textContent = formatBDT(0);
    return;
  }

  cart.forEach((it, idx) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";

    const nameSpan = document.createElement("span");
    nameSpan.className = "truncate";
    nameSpan.textContent = it.name;
    nameSpan.title = it.name;

    const rightWrap = document.createElement("div");
    rightWrap.className = "flex items-center gap-3";

    const priceSpan = document.createElement("span");
    priceSpan.textContent = `${formatBDT(it.price)} × ${it.qty}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "text-red-500 remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      if (cart[idx].qty > 1) cart[idx].qty -= 1;
      else {
        removeFromCart(idx);
        return;
      }
      renderCart();
    });

    rightWrap.appendChild(priceSpan);
    rightWrap.appendChild(removeBtn);
    li.appendChild(nameSpan);
    li.appendChild(rightWrap);

    cartList.appendChild(li);
  });

  const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  totalPriceEl.textContent = formatBDT(total);
}

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

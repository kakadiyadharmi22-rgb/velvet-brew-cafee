(function () {
  "use strict";

  var dishes = [
    {id:1,name:"Velvet Cappuccino",category:"Coffee",price:180,tag:"HOUSE FAVOURITE",description:"A velvety espresso topped with silky steamed milk and a soft cloud of foam.",image:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85"},
    {id:2,name:"Caramel Cloud Latte",category:"Coffee",price:210,tag:"BEST SELLER",description:"Smooth espresso, warm milk and a ribbon of buttery caramel sweetness.",image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85"},
    {id:3,name:"Classic Americano",category:"Coffee",price:150,tag:"SIMPLE & BOLD",description:"Rich espresso mellowed with hot water for a clean, comforting cup.",image:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85"},
    {id:4,name:"Mocha Melt",category:"Coffee",price:220,tag:"CHOCOLATE LOVE",description:"Espresso meets chocolate and steamed milk for a deeply cosy treat.",image:"https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=900&q=85"},
    {id:5,name:"Iced Vanilla Latte",category:"Cold Drinks",price:230,tag:"COOL FAVOURITE",description:"Chilled espresso, creamy milk, vanilla and ice — refreshingly smooth.",image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85"},
    {id:6,name:"Cold Brew",category:"Cold Drinks",price:200,tag:"SLOW STEEPED",description:"Coffee steeped slowly for a smooth, mellow and refreshing finish.",image:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85"},
    {id:7,name:"Chocolate Frappe",category:"Cold Drinks",price:250,tag:"COOL & CREAMY",description:"A chilled, blended chocolate coffee treat for your sweet-tooth days.",image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85"},
    {id:8,name:"Strawberry Iced Tea",category:"Cold Drinks",price:170,tag:"FRUITY & FRESH",description:"A refreshing iced tea with bright berry notes and a gentle sweetness.",image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85"},
    {id:9,name:"Chocolate Fudge Cake",category:"Desserts",price:190,tag:"RICH & DECADENT",description:"A soft, rich chocolate cake made for those just-one-more-bite moments.",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85"},
    {id:10,name:"New York Cheesecake",category:"Desserts",price:220,tag:"CREAMY CLASSIC",description:"A smooth, creamy cheesecake with a buttery biscuit base.",image:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85"},
    {id:11,name:"Butter Croissant",category:"Bakery",price:130,tag:"BAKED FRESH",description:"Golden, flaky layers with a delicate buttery centre — lovely with coffee.",image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85"},
    {id:12,name:"Cinnamon Roll",category:"Bakery",price:160,tag:"WARM & SPICED",description:"Soft swirls of cinnamon sweetness finished with a light glaze.",image:"https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85"},
    {id:13,name:"Avocado Toast",category:"Light Bites",price:260,tag:"FRESH PICK",description:"Creamy avocado on toasted artisan bread with herbs and a little crunch.",image:"https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85"},
    {id:14,name:"Grilled Veg Sandwich",category:"Light Bites",price:240,tag:"CAFÉ CLASSIC",description:"Grilled bread filled with colourful vegetables, cheese and house seasoning.",image:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85"},
    {id:15,name:"Loaded Fries",category:"Light Bites",price:210,tag:"SHAREABLE",description:"Crispy golden fries with a savoury topping for the table to share.",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85"},
    {id:16,name:"Classic Hot Chocolate",category:"Coffee",price:190,tag:"COSY CUP",description:"A warm, chocolatey cup with a silky texture and comforting finish.",image:"https://images.unsplash.com/photo-1542990253-0b8be7b4f6e0?auto=format&fit=crop&w=900&q=85"}
  ];

  var state = { page: "home", category: "All", search: "", sort: "featured", pageNumber: 1, pageSize: 6, cart: {}, selectedDish: null };
  var $ = function (selector) { return document.querySelector(selector); };
  var $$ = function (selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); };

  function readStore(key, fallback) {
    try { var value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch (error) { return fallback; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }
  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character];
    });
  }
  function money(value) { return "₹" + Number(value || 0).toLocaleString("en-IN"); }
  function dishById(id) {
    for (var i = 0; i < dishes.length; i++) if (dishes[i].id === Number(id)) return dishes[i];
    return null;
  }
  function showToast(message) {
    var toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    if (showToast.timer) window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("visible"); }, 2500);
  }
  function navigate(page) {
    if (!$("#page-" + page)) page = "home";
    state.page = page;
    $$(".page").forEach(function (element) { element.classList.toggle("active", element.getAttribute("data-view") === page); });
    $$(".nav-link").forEach(function (element) { element.classList.toggle("active", element.getAttribute("data-page") === page); });
    $("#mainNav").classList.remove("open");
    $("#mobileMenuButton").setAttribute("aria-expanded", "false");
    if (window.location.hash !== "#" + page) {
      try { history.replaceState(null, "", "#" + page); } catch (error) { window.location.hash = page; }
    }
    if (page === "menu") renderMenu();
    if (page === "profile") renderProfile();
    window.scrollTo(0, 0);
  }
  function imageMarkup(dish, extraClass) {
    return '<img class="' + (extraClass || "") + '" src="' + escapeHTML(dish.image) + '" alt="' + escapeHTML(dish.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80\';">';
  }
  function cardMarkup(dish) {
    return '<article class="menu-card">' +
      '<div class="menu-card-image" data-dish="' + dish.id + '" role="button" tabindex="0" aria-label="View ' + escapeHTML(dish.name) + '">' +
      imageMarkup(dish, "") + '<span class="menu-card-tag">' + escapeHTML(dish.tag) + '</span></div>' +
      '<div class="menu-card-body"><div class="menu-card-top"><h3>' + escapeHTML(dish.name) + '</h3><span class="menu-card-price">' + money(dish.price) + '</span></div>' +
      '<p class="menu-card-description">' + escapeHTML(dish.description) + '</p>' +
      '<div class="menu-card-footer"><span class="card-rating">★★★★★ <span style="color:#a99a89;letter-spacing:0">Café pick</span></span>' +
      '<button class="add-button" data-add="' + dish.id + '">+ ADD TO BAG</button></div></div></article>';
  }
  function renderFeatured() {
    var featured = [dishes[0], dishes[8], dishes[10]];
    $("#featuredGrid").innerHTML = featured.map(cardMarkup).join("");
  }
  function renderCategories() {
    var categories = ["All", "Coffee", "Cold Drinks", "Desserts", "Bakery", "Light Bites"];
    $("#categoryFilters").innerHTML = categories.map(function (category) {
      return '<button class="category-button ' + (state.category === category ? "active" : "") + '" data-category="' + escapeHTML(category) + '">' + escapeHTML(category) + '</button>';
    }).join("");
  }
  function getFilteredDishes() {
    var filtered = dishes.filter(function (dish) {
      var categoryMatch = state.category === "All" || dish.category === state.category;
      var text = (dish.name + " " + dish.category + " " + dish.description + " " + dish.tag).toLowerCase();
      return categoryMatch && text.indexOf(state.search.toLowerCase()) !== -1;
    });
    if (state.sort === "low") filtered.sort(function (a,b){return a.price-b.price;});
    else if (state.sort === "high") filtered.sort(function (a,b){return b.price-a.price;});
    else if (state.sort === "name") filtered.sort(function (a,b){return a.name.localeCompare(b.name);});
    return filtered;
  }
  function renderMenu() {
    renderCategories();
    var filtered = getFilteredDishes();
    var totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.pageNumber > totalPages) state.pageNumber = totalPages;
    var start = (state.pageNumber - 1) * state.pageSize;
    var current = filtered.slice(start, start + state.pageSize);
    $("#menuResultCount").textContent = filtered.length ? "Showing " + (start + 1) + "–" + Math.min(start + state.pageSize, filtered.length) + " of " + filtered.length + " favourites" : "No items found";
    $("#menuGrid").innerHTML = current.length ? current.map(cardMarkup).join("") : '<div class="no-results"><strong>No treats found.</strong>Try another search or category.</div>';
    var buttons = '<button class="page-number" data-page-number="' + (state.pageNumber - 1) + '" ' + (state.pageNumber === 1 ? "disabled" : "") + ' aria-label="Previous page">‹</button>';
    for (var i = 1; i <= totalPages; i++) buttons += '<button class="page-number ' + (i === state.pageNumber ? "active" : "") + '" data-page-number="' + i + '" aria-label="Page ' + i + '">' + i + '</button>';
    buttons += '<button class="page-number" data-page-number="' + (state.pageNumber + 1) + '" ' + (state.pageNumber === totalPages ? "disabled" : "") + ' aria-label="Next page">›</button>';
    $("#pagination").innerHTML = buttons;
  }
  function getCartItems() {
    return Object.keys(state.cart).map(function (id) {
      var dish = dishById(id);
      if (!dish) return null;
      return {dish:dish, quantity:Math.max(0, Number(state.cart[id]) || 0)};
    }).filter(function (item) { return item && item.quantity > 0; });
  }
  function cartQuantity() {
    return getCartItems().reduce(function (total, item) { return total + item.quantity; }, 0);
  }
  function cartTotal() {
    return getCartItems().reduce(function (total, item) { return total + item.dish.price * item.quantity; }, 0);
  }
  function saveCart() { writeStore("velvetBrewCart", state.cart); }
  function renderCart() {
    var items = getCartItems();
    $("#cartCount").textContent = cartQuantity();
    $("#profileCartCount").textContent = cartQuantity();
    $("#cartItems").innerHTML = items.map(function (item) {
      return '<div class="cart-item"><img src="' + escapeHTML(item.dish.image) + '" alt="' + escapeHTML(item.dish.name) + '">' +
        '<div><h3>' + escapeHTML(item.dish.name) + '</h3><small>' + money(item.dish.price) + '</small>' +
        '<div class="quantity-control"><button data-qty="' + item.dish.id + '" data-change="-1" aria-label="Decrease quantity">−</button><span>' + item.quantity + '</span><button data-qty="' + item.dish.id + '" data-change="1" aria-label="Increase quantity">+</button></div></div>' +
        '<button class="remove-item" data-remove="' + item.dish.id + '" aria-label="Remove ' + escapeHTML(item.dish.name) + '">×</button></div>';
    }).join("");
    $("#cartEmpty").style.display = items.length ? "none" : "block";
    $("#cartSummary").style.display = items.length ? "block" : "none";
    $("#cartSubtotal").textContent = money(cartTotal());
  }
  function addToCart(id) {
    var dish = dishById(id);
    if (!dish) return;
    state.cart[id] = (Number(state.cart[id]) || 0) + 1;
    saveCart(); renderCart();
    showToast(dish.name + " added to your bag");
  }
  function openCart() {
    $("#cartDrawer").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("visible");
    document.body.classList.add("no-scroll");
  }
  function closePanels() {
    $("#cartDrawer").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    $("#dishModal").classList.remove("open");
    $("#dishModal").setAttribute("aria-hidden", "true");
    $("#overlay").classList.remove("visible");
    document.body.classList.remove("no-scroll");
  }
  function openDish(id) {
    var dish = dishById(id);
    if (!dish) return;
    state.selectedDish = dish;
    $("#modalDishImage").src = dish.image;
    $("#modalDishImage").alt = dish.name;
    $("#modalDishName").textContent = dish.name;
    $("#modalDishCategory").textContent = dish.category.toUpperCase() + " · " + dish.tag;
    $("#modalDishDescription").textContent = dish.description;
    $("#modalDishPrice").textContent = money(dish.price);
    $("#rotationSlider").value = 0;
    $("#rotationValue").textContent = "0°";
    $("#modalDishImage").style.transform = "perspective(900px) rotateY(0deg) rotateZ(0deg)";
    $("#dishModal").classList.add("open");
    $("#dishModal").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("visible");
    document.body.classList.add("no-scroll");
  }
  function renderProfile() {
    var profile = readStore("velvetBrewProfile", {});
    $("#profileName").value = profile.name || "";
    $("#profileEmail").value = profile.email || "";
    $("#profileNote").value = profile.note || "";
    var displayName = profile.name || "Coffee lover";
    $("#profileDisplayName").textContent = displayName;
    $("#profileAvatar").textContent = displayName.charAt(0).toUpperCase();
    $("#visitCount").textContent = readStore("velvetBrewVisits", 1);
    $("#profileCartCount").textContent = cartQuantity();
    var orders = readStore("velvetBrewOrders", []);
    $("#orderHistory").innerHTML = orders.length ? orders.slice().reverse().map(function (order) {
      return '<div class="order-row"><div><strong>Order ' + escapeHTML(order.id) + '</strong><small>' + escapeHTML(order.date) + ' · ' + escapeHTML(order.items) + '</small></div><strong>' + money(order.total) + '</strong></div>';
    }).join("") : '<div class="empty-history">No demo orders yet. Your placed demo orders will appear here.</div>';
  }
  function placeDemoOrder() {
    var items = getCartItems();
    if (!items.length) return;
    var orders = readStore("velvetBrewOrders", []);
    var order = {
      id: "VB" + String(new Date().getTime()).slice(-6),
      date: new Date().toLocaleString(),
      items: items.map(function (item) { return item.dish.name + " × " + item.quantity; }).join(", "),
      total: cartTotal()
    };
    orders.push(order);
    writeStore("velvetBrewOrders", orders);
    state.cart = {};
    saveCart(); renderCart(); renderProfile();
    closePanels();
    showToast("Demo order placed! No payment was taken.");
    if (state.page === "profile") renderProfile();
  }
  function initVisits() {
    var visits = Number(readStore("velvetBrewVisits", 0)) || 0;
    visits += 1;
    writeStore("velvetBrewVisits", visits);
    $("#visitCount").textContent = visits;
  }

  document.addEventListener("click", function (event) {
    var pageLink = event.target.closest ? event.target.closest("[data-page]") : null;
    var goButton = event.target.closest ? event.target.closest("[data-go]") : null;
    var addButton = event.target.closest ? event.target.closest("[data-add]") : null;
    var dishCard = event.target.closest ? event.target.closest("[data-dish]") : null;
    var categoryButton = event.target.closest ? event.target.closest("[data-category]") : null;
    var pageButton = event.target.closest ? event.target.closest("[data-page-number]") : null;
    var quantityButton = event.target.closest ? event.target.closest("[data-qty]") : null;
    var removeButton = event.target.closest ? event.target.closest("[data-remove]") : null;
    if (pageLink) { event.preventDefault(); navigate(pageLink.getAttribute("data-page")); return; }
    if (goButton) { navigate(goButton.getAttribute("data-go")); return; }
    if (addButton) { addToCart(addButton.getAttribute("data-add")); return; }
    if (dishCard) { openDish(dishCard.getAttribute("data-dish")); return; }
    if (categoryButton) { state.category = categoryButton.getAttribute("data-category"); state.pageNumber = 1; renderMenu(); return; }
    if (pageButton && !pageButton.disabled) { state.pageNumber = Number(pageButton.getAttribute("data-page-number")); renderMenu(); return; }
    if (quantityButton) {
      var id = quantityButton.getAttribute("data-qty");
      state.cart[id] = (Number(state.cart[id]) || 0) + Number(quantityButton.getAttribute("data-change"));
      if (state.cart[id] <= 0) delete state.cart[id];
      saveCart(); renderCart(); return;
    }
    if (removeButton) { delete state.cart[removeButton.getAttribute("data-remove")]; saveCart(); renderCart(); return; }
  });

  $("#mobileMenuButton").addEventListener("click", function () {
    var nav = $("#mainNav");
    var open = nav.classList.toggle("open");
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $("#openCartButton").addEventListener("click", openCart);
  $("#closeCartButton").addEventListener("click", closePanels);
  $("#overlay").addEventListener("click", closePanels);
  $("#closeDishModal").addEventListener("click", closePanels);
  $("#checkoutButton").addEventListener("click", placeDemoOrder);
  $("#menuSearch").addEventListener("input", function () { state.search = this.value.trim(); state.pageNumber = 1; renderMenu(); });
  $("#menuSort").addEventListener("change", function () { state.sort = this.value; state.pageNumber = 1; renderMenu(); });
  $("#rotationSlider").addEventListener("input", function () {
    var value = Number(this.value);
    $("#rotationValue").textContent = value + "°";
    $("#modalDishImage").style.transform = "perspective(900px) rotateY(" + (value * 2) + "deg) rotateZ(" + (value / 3) + "deg)";
  });
  $("#profileForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var profile = {name:$("#profileName").value.trim(),email:$("#profileEmail").value.trim(),note:$("#profileNote").value.trim()};
    writeStore("velvetBrewProfile", profile);
    renderProfile();
    $("#profileMessage").textContent = "Your details have been saved on this device.";
    showToast("Profile saved");
  });
  $("#newsletterForm").addEventListener("submit", function (event) {
    event.preventDefault();
    $("#newsletterMessage").textContent = "Thanks for your interest! This demo does not send emails yet.";
    this.reset();
  });
  $("#backToTop").addEventListener("click", function () { window.scrollTo({top:0,behavior:"smooth"}); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePanels();
    if ((event.key === "Enter" || event.key === " ") && event.target.classList && event.target.classList.contains("menu-card-image")) {
      event.preventDefault(); openDish(event.target.getAttribute("data-dish"));
    }
  });
  window.addEventListener("hashchange", function () {
    var page = (window.location.hash || "#home").replace("#", "");
    if ($("#page-" + page) && page !== state.page) navigate(page);
  });

  $("#currentYear").textContent = new Date().getFullYear();
  state.cart = readStore("velvetBrewCart", {});
  initVisits();
  renderFeatured();
  renderMenu();
  renderCart();
  renderProfile();
  var initialPage = (window.location.hash || "#home").replace("#", "");
  navigate($("#page-" + initialPage) ? initialPage : "home");
})();

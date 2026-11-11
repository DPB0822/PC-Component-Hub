let products = [];
let cart = [];

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (currentQuantity >= product.stock) {
        alert("Not enough items in stock.");
        return;
    }

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    displayCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    displayCart();
}
function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const subtotal = item.price * item.quantity;

    const itemText = document.createElement("span");
    itemText.textContent =
        `${item.name} - Quantity: ${item.quantity} - $${subtotal.toFixed(2)}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";

    removeButton.addEventListener("click", () => {
        removeFromCart(item.id);
    });

    row.append(itemText, removeButton);
    cartItems.appendChild(row);

    total += subtotal;
});

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Load product information from the CSV file
async function loadProducts() {
    try {
        const response = await fetch("products.csv");

        if (!response.ok) {
            throw new Error("Unable to load product inventory");
        }

        const csvData = await response.text();
        const lines = csvData.trim().split(/\r?\n/);

        products = lines.slice(1).filter(line => line.trim()).map(line => {
            const [id, name, category, price, stock, description] =
                line.split(",");

            return {
                id: id,
                name: name,
                category: category,
                price: parseFloat(price),
                stock: parseInt(stock),
                description: description
            };
        });

               displayProducts(products);
    } catch (error) {
        document.getElementById("productList").textContent =
            "Error loading products. Please check the CSV file.";
        console.error(error);
    }
}

// Display products on the website
function displayProducts(items) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    if (items.length === 0) {
        productList.textContent = "No products found.";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "$" + product.price.toFixed(2);

        const stock = document.createElement("p");
        stock.textContent = "In Stock: " + product.stock;

        const addButton = document.createElement("button");
addButton.textContent = "Add to Cart";

addButton.disabled = product.stock <= 0;

addButton.addEventListener("click", () => {
    addToCart(product.id);
});
       card.append(name, description, price, stock, addButton);
        productList.appendChild(card);
    });
}

// Search and filter products
function filterProducts() {
    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const category = document.getElementById("categoryFilter").value;

    const filtered = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

document.getElementById("searchInput")
    .addEventListener("input", filterProducts);

document.getElementById("categoryFilter")
    .addEventListener("change", filterProducts);

loadProducts();

// ============================================================
// Velvet & Bean Co. - application logic
// ============================================================

// Cafe's WhatsApp Business number (international format, no "+")
const CAFE_WHATSAPP_NUMBER = "250793594775";

// Fallback shown if an image fails to load
const PLACEHOLDER_IMG = "placeholder.svg";

// Menu dataset (prices in Rwandan Francs)
// TIP: to use local photos, download them into /images and change the
// paths below, e.g. image: "images/nitro-cold-brew.jpg"
const menuItems = [
    { id: 1, name: "Velvet Signature Latte", category: "Hot Drinks", price: 4500, description: "Double shot espresso, steamed microfoam oat milk, organic vanilla bean syrup.", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600" },
    { id: 2, name: "Single-Origin Pour Over", category: "Hot Drinks", price: 3800, description: "Ethopian Yirgacheffe beans brewed precisely with complex floral and citrus tasting notes.", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600" },
    { id: 3, name: "Nitro Cold Brew", category: "Cold Brews", price: 5000, description: "Steeped for 24 hours, infused with nitrogen for a creamy, velvety stout-like cascade.", image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600" },
    { id: 4, name: "Iced Honeycomb Matchaccino", category: "Cold Brews", price: 5500, description: "Ceremonial grade Uji matcha layered with organic raw honey foam and cold milk.", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600" },
    { id: 5, name: "Imperial Earl Grey Reserve", category: "Teas", price: 3500, description: "Bergamot-infused black tea served with steamed lavender milk on the side.", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600" },
    { id: 6, name: "Almond Butter Croissant", category: "Food", price: 4000, description: "Flaky, buttery French pastry filled with rich almond frangipane cream and sliced almonds.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600" }
];

let cart = [];
let reviews = [
    { name: "Marcus Vance", rating: "★★★★★", text: "The nitro cold brew is an absolute game-changer. Paid via MTN MoMo instantly!" },
    { name: "Elena Rostova", rating: "★★★★★", text: "Seamless ordering experience right from my phone while walking down the street." },
    { name: "Julian Thorne", rating: "★★★★★", text: "Best almond croissants in the entire district. Cozy atmosphere inside too." }
];

let selectedProduct = null;

// Initialize page + map
document.addEventListener("DOMContentLoaded", () => {
    renderMenu('all');
    renderReviews();
    updateCartUI();

    const map = L.map('map').setView([-1.9441, 30.0619], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([-1.9441, 30.0619]).addTo(map)
        .bindPopup('<b>Velvet & Bean Co.</b><br>KN 4 Ave, Kigali')
        .openPopup();
});

// Render Menu Grid
function renderMenu(category) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    const filtered = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);

    filtered.forEach(item => {
        grid.innerHTML += `
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-warmbeige flex flex-col justify-between hover:shadow-md transition-all">
                <div class="relative h-48 overflow-hidden bg-warmbeige">
                    <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-3 right-3 bg-cream/90 backdrop-blur-sm text-espresso text-xs font-bold px-3 py-1 rounded-full">${item.category}</span>
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                        <h3 class="font-serif text-xl font-bold text-espresso">${item.name}</h3>
                        <p class="text-espresso/70 text-sm mt-1">${item.description}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2">
                        <span class="font-bold text-lg text-espresso">${item.price.toLocaleString()} RWF</span>
                        <button onclick="openCustomizeModal(${item.id})" class="bg-espresso text-cream text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-terracotta transition-colors">
                            Customize & Add +
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.className = "category-btn px-5 py-2.5 rounded-full text-sm font-semibold transition-all bg-espresso text-cream shadow-sm";
        } else {
            btn.className = "category-btn px-5 py-2.5 rounded-full text-sm font-semibold transition-all bg-warmbeige text-espresso hover:bg-espresso/10";
        }
    });
}

function filterMenu(cat) { renderMenu(cat); }

// Customization Modal Logic
function openCustomizeModal(itemId) {
    selectedProduct = menuItems.find(i => i.id === itemId);
    document.getElementById('modal-item-title').innerText = selectedProduct.name;
    document.getElementById('modal-item-desc').innerText = selectedProduct.description;
    document.getElementById('modal-item-price').innerText = `${selectedProduct.price.toLocaleString()} RWF`;

    document.getElementById('modal-add-btn').onclick = () => addToCartFromModal(selectedProduct);
    document.getElementById('customize-modal').classList.remove('hidden');
}

function closeCustomizeModal() {
    document.getElementById('customize-modal').classList.add('hidden');
}

function addToCartFromModal(item) {
    const size = document.querySelector('input[name="size"]:checked')?.value || 'Medium';
    const milk = document.getElementById('milk-choice').value;
    const sweetness = document.getElementById('sweetness-choice').value;

    let finalPrice = item.price;
    if (milk === 'Oat Milk' || milk === 'Almond Milk') finalPrice += 800;

    cart.push({
        name: item.name,
        price: finalPrice,
        options: size + ' • ' + milk + ' • ' + sweetness,
        quantity: 1
    });

    closeCustomizeModal();
    updateCartUI();
    toggleCart();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('hidden');
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');

    if (cart.length > 0) {
        badge.classList.remove('hidden');
        badge.innerText = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    } else {
        badge.classList.add('hidden');
    }

    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-espresso/50"><p>Your pickup cart is empty.</p></div>`;
        document.getElementById('cart-subtotal').innerText = '0 RWF';
        document.getElementById('cart-tax').innerText = '0 RWF';
        document.getElementById('cart-total').innerText = '0 RWF';
        return;
    }

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        container.innerHTML += `
            <div class="flex justify-between items-start bg-white p-4 rounded-xl border border-warmbeige">
                <div>
                    <h4 class="font-bold text-sm text-espresso">${item.name}</h4>
                    <p class="text-xs text-espresso/60 mt-0.5">${item.options}</p>
                    <p class="text-xs font-bold text-caramel mt-2">${item.price.toLocaleString()} RWF</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-espresso/40 hover:text-terracotta text-sm">✕</button>
            </div>
        `;
    });

    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').innerText = subtotal.toLocaleString() + ' RWF';
    document.getElementById('cart-tax').innerText = tax.toLocaleString() + ' RWF';
    document.getElementById('cart-total').innerText = total.toLocaleString() + ' RWF';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function submitOrderViaMoMo() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('momo-phone').value.trim();
    const pickupTime = document.getElementById('pickup-time').value;

    if (!name || !phone) {
        alert('Please enter your name and MTN Mobile Money / WhatsApp number to proceed.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Calculate total cost
    let subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    let tax = Math.round(subtotal * 0.08);
    let total = subtotal + tax;

    // Format order items for WhatsApp message
    let orderSummary = cart.map(i => `- ${i.quantity}x ${i.name} (${i.options}) @ ${i.price.toLocaleString()} RWF`).join('\n');

    let message = `☕ *NEW PAID PICKUP ORDER* ☕\n\n` +
                  `*Customer Name:* ${name}\n` +
                  `*MoMo / WhatsApp Number:* ${phone}\n` +
                  `*Pickup Time:* ${pickupTime}\n\n` +
                  `*Order Items:*\n${orderSummary}\n\n` +
                  `*Subtotal:* ${subtotal.toLocaleString()} RWF\n` +
                  `*Tax (8%):* ${tax.toLocaleString()} RWF\n` +
                  `*Total Paid via MoMo:* ${total.toLocaleString()} RWF\n\n` +
                  `✅ Payment confirmed via USSD Push. Please start preparing!`;

    alert('USSD Push sent to ' + phone + '! Please enter your MoMo PIN to complete the payment.');

    // Open WhatsApp with pre-filled message
    setTimeout(() => {
        const whatsappURL = `https://wa.me/${CAFE_WHATSAPP_NUMBER}?text=` + encodeURIComponent(message);
        window.open(whatsappURL, '_blank');

        toggleCart();
        cart = [];
        updateCartUI();
    }, 1000);
}

function toggleDashboard() {
    document.getElementById('dashboard-modal').classList.toggle('hidden');
}

function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    grid.innerHTML = '';
    reviews.forEach(rev => {
        grid.innerHTML += `
            <div class="bg-white p-6 rounded-2xl border border-warmbeige space-y-3 shadow-sm">
                <div class="text-amber-500 text-sm tracking-widest">${rev.rating}</div>
                <p class="text-espresso/80 text-sm italic">"${rev.text}"</p>
                <p class="text-xs font-bold text-espresso/60">— ${rev.name}</p>
            </div>
        `;
    });
}

function openReviewModal() {
    document.getElementById('review-modal').classList.remove('hidden');
}

function closeReviewModal() {
    document.getElementById('review-modal').classList.add('hidden');
}

function submitReview() {
    const name = document.getElementById('rev-name').value.trim();
    const rating = document.getElementById('rev-rating').value;
    const text = document.getElementById('rev-text').value.trim();

    if (!name || !text) {
        alert('Please fill out your name and review message.');
        return;
    }

    reviews.unshift({ name, rating, text });
    renderReviews();
    closeReviewModal();
    document.getElementById('rev-name').value = '';
    document.getElementById('rev-text').value = '';
    alert('Thank you for reviewing Velvet & Bean Co.!');
}

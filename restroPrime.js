       //1. MENU DATABASE

   const menuData = {
    breakfast: [
        { id: 101, name: "Bhuna Khichuri", price: 250, desc: "Aromatic rice cooked with lentils and spices.", img: "/assets/bhuna_khichuri.jpg" },
        { id: 102, name: "Aloo Paratha & Dim", price: 120, desc: "Stuffed potato flatbread served with fried egg.", img: "/assets/AlooParathaAndDimBhaji.jpg" },
        { id: 103, name: "Beef Nehari With Naan", price: 350, desc: "Slow-cooked beef shank stew served with Naan.", img: "/assets/BeefNehariWithNaan.jpg" },
        { id: 104, name: "Chicken Corn Soup", price: 180, desc: "Classic thick soup with sweet corn and egg drop.", img: "/assets/ChickenCornSoup.jpg" },
        { id: 105, name: "Mutton Nalli With Butter Naan", price: 100, desc: "Slow cooked mutton nalli served with butter naan.", img: "/assets/MuttonNalliWithButterNaan.jpg" }
    ],
    lunch: [
        { id: 201, name: "Kacchi Biryani", price: 450, desc: "Layers of mutton and rice cooked with saffron.", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400" },
        { id: 202, name: "Ilish Pulao", price: 600, desc: "Fragrant rice served with national Hilsa fish.", img: "/assets/IlishPulao.jpg" },
        { id: 203, name: "Chui Jhal Beef", price: 400, desc: "Spicy regional beef curry with piper chaba.", img: "/assets/ChuiJhalBeef.jpg" },
        { id: 204, name: "Vorta Platter", price: 200, desc: "Assortment of spicy mashed vegetables and fish.", img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400" },
        { id: 205, name: "Rui Macher Kalia", price: 300, desc: "Rich and spicy carp fish curry.", img: "/assets/RuiMacherKalia.jpg" }
    ],
    dinner: [
        { id: 301, name: "Chicken Roast And Polao", price: 380, desc: "Bangladeshi style wedding roast chicken.", img: "/assets/ChickenRoastAndPolao.jpg" },
        { id: 302, name: "Beef Rezala", price: 420, desc: "Mughlai style beef curry with yogurt gravy.", img: "/assets/BeefRezala.jpg" },
        { id: 303, name: "Mutton Glassi", price: 500, desc: "Tender mutton cooked in thick spicy gravy.", img: "/assets/MuttonGlassy.jpg" },
        { id: 304, name: "Grilled Chicken", price: 350, desc: "Charcoal grilled chicken served with Naan.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400" },
        { id: 305, name: "Tandoori Platter", price: 800, desc: "Mix of kebabs and tandoori items.", img: "/assets/TandooriPlatter.jpg" }
    ],
    drinks: [
        { id: 401, name: "Borhani", price: 80, desc: "Spicy yogurt drink, best digestive.", img: "/assets/Borhani.jpg" },
        { id: 402, name: "Masala Tea", price: 40, desc: "Strong tea with ginger and spices.", img: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=400" },
        { id: 403, name: "Fresh Lime", price: 60, desc: "Refreshing lemon juice with mint.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400" },
        { id: 404, name: "Lassi", price: 100, desc: "Sweet and creamy yogurt smoothie.", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400" }
    ]
};

let currentUser = null;
let cart = [];

   //2. INITIALIZATION & VIEW MANAGEMENT

   document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('nav-menu').classList.toggle('active');
    });

    // Restore Session
    const savedUser = JSON.parse(localStorage.getItem('rp_current_user'));
    if (savedUser) {
        currentUser = savedUser;
        updateNavAuth();
        
        // Show Admin link if Admin
        if(currentUser.role === 'admin') {
            document.getElementById('nav-admin-link').style.display = 'block';
        }
    }

    renderTables();       
    renderMenu();         
    updateMenuOrder();    
    updateAdminView();
    updateCartDisplay();
});

function switchView(viewName) {
    const publicView = document.getElementById('public-view');
    const adminView = document.getElementById('admin-view');

    if (viewName === 'admin') {
        publicView.style.display = 'none';
        adminView.style.display = 'block';
        updateAdminView();
    } else {
        adminView.style.display = 'none';
        publicView.style.display = 'block';
    }
    // Close mobile menu if open
    document.getElementById('nav-menu').classList.remove('active');
}

function updateNavAuth() {
    const btn = document.getElementById('nav-auth-btn');
    if(currentUser) {
        btn.innerText = `Hi, ${currentUser.fname || currentUser.name} (Logout)`;
        btn.onclick = logout;
    } else {
        btn.innerText = "Login";
        btn.onclick = triggerAuth;
    }
}

   //3. AUTHENTICATION (Popups, Eye Icon, Validation)

function triggerAuth() {
    document.getElementById('auth-overlay').style.display = 'flex';
}

function closeAuth() {
    document.getElementById('auth-overlay').style.display = 'none';
}

function toggleAuth(type) {
    if(type === 'signup') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    } else {
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
}

// Toggle Eye Icon Logic
function togglePassword(fieldId, icon) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
        icon.innerText = "🙈"; 
    } else {
        input.type = "password";
        icon.innerText = "👁️"; 
    }
}

// Global Action Handler
function handleAction(actionType, id = null) {
    if (!currentUser) {
        triggerAuth(); 
        return;
    }

    if (actionType === 'reserve') {
        window.location.href = '#booking';
    } else if (actionType === 'bookTable') {
        bookTable(id);
    } else if (actionType === 'checkout') {
        checkout();
    }
}

function handleLogin() {
    const identifier = document.getElementById('login-identifier').value;
    const pass = document.getElementById('login-pass').value;
    const isAdmin = document.getElementById('admin-checkbox').checked;

    // 1. ADMIN CHECK (Strict)
    if(isAdmin) {
        if(identifier === 'Raian' && pass === 'raian24') {
            loginSuccess({ name: 'Admin', role: 'admin' });
        } else {
            alert('Incorrect Admin Username or Password!');
        }
        return;
    }

    // 2. USER CHECK (Email OR Phone)
    let users = JSON.parse(localStorage.getItem('rp_users')) || [];
    const found = users.find(u => (u.email === identifier || u.phone === identifier) && u.pass === pass);

    if(found) {
        loginSuccess({ ...found, role: 'user' });
    } else {
        alert('Invalid Email/Phone or Password');
    }
}

function handleSignup() {
    const fname = document.getElementById('signup-fname').value;
    const lname = document.getElementById('signup-lname').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const pass = document.getElementById('signup-pass').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if(!fname || !lname || !email || !phone || !pass) {
        alert("Please fill all fields.");
        return;
    }

    if(pass !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('rp_users')) || [];
    
    // Check duplication
    if(users.some(u => u.email === email || u.phone === phone)) {
        alert("Email or Phone already registered!");
        return;
    }

    users.push({ fname, lname, email, phone, pass });
    localStorage.setItem('rp_users', JSON.stringify(users));
    
    alert('Registration Successful! Please Login.');
    toggleAuth('login');
}

function loginSuccess(userObj) {
    currentUser = userObj;
    localStorage.setItem('rp_current_user', JSON.stringify(currentUser));
    updateNavAuth();
    closeAuth();
    
    if(currentUser.role === 'admin') {
        document.getElementById('nav-admin-link').style.display = 'block';
        // Auto switch to admin view if logging in as admin
        switchView('admin');
    }
}

function logout() {
    localStorage.removeItem('rp_current_user');
    location.reload();
}

   //4. MENU & MODAL

function updateMenuOrder() {
    const now = new Date();
    const hour = now.getHours();
    const wrapper = document.getElementById('dynamic-menu-wrapper');
    const msg = document.getElementById('current-time-msg');
    
    const bf = document.getElementById('breakfast-container');
    const lh = document.getElementById('lunch-container');
    const dn = document.getElementById('dinner-container');
    const dr = document.getElementById('drinks-container');

    if (hour >= 6 && hour < 12) {
        msg.innerText = "Good Morning! Now Serving Breakfast.";
        wrapper.prepend(bf); 
    } else if (hour >= 12 && hour < 19) {
        msg.innerText = "Good Afternoon! Lunch is Served.";
        wrapper.prepend(lh);
    } else {
        msg.innerText = "Good Evening! Dinner Specials Available.";
        wrapper.prepend(dn);
    }
    wrapper.append(dr);
}

function renderMenu() {
    Object.keys(menuData).forEach(cat => {
        const grid = document.querySelector(`#${cat}-container .menu-grid`);
        grid.innerHTML = '';
        
        menuData[cat].forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.onclick = () => openModal(cat, item.id);
            
            card.innerHTML = `
                <img src="${item.img}">
                <div class="menu-card-info">
                    <h4>${item.name}</h4>
                    <p class="price-tag">৳${item.price}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    });
}

function openModal(category, id) {
    const item = menuData[category].find(i => i.id === id);
    if(!item) return;

    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-price').innerText = "৳" + item.price;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-qty').value = 1; 
    
    const btn = document.getElementById('modal-add-btn');
    btn.onclick = () => {
        const qty = parseInt(document.getElementById('modal-qty').value);
        addToCart(item, qty);
        closeModal();
    };

    document.getElementById('desc-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('desc-modal').style.display = 'none';
}


    //5. CART & CHECKOUT

function addToCart(item, qty) {
    for(let i=0; i<qty; i++) {
        cart.push({ ...item, cartId: Date.now() + i, selected: true });
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const countSpan = document.getElementById('cart-count');
    const totalSpan = document.getElementById('cart-total-display');
    
    countSpan.innerText = cart.length;
    container.innerHTML = '';

    if(cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalSpan.innerText = "৳0";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        if(item.selected) total += item.price;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-info">
                <input type="checkbox" ${item.selected ? 'checked' : ''} onchange="toggleSelect(${index})">
                <img src="${item.img}" class="cart-thumb">
                <div>
                    <h4>${item.name}</h4>
                    <p>৳${item.price}</p>
                </div>
            </div>
            <button class="delete-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(row);
    });

    totalSpan.innerText = "৳" + total;
}

function toggleSelect(index) {
    cart[index].selected = !cart[index].selected;
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function checkout() {
    const selected = cart.filter(i => i.selected);
    if(selected.length === 0) {
        alert("Please select items to checkout.");
        return;
    }
    
    const amount = selected.reduce((sum, i) => sum + i.price, 0);
    if(confirm(`Confirm Order for ৳${amount}?`)) {
        cart = cart.filter(i => !i.selected);
        updateCartDisplay();
        alert("Order Placed Successfully!");
    }
}

   //6. TABLE & ADMIN (Separate View)

function renderTables() {
    const map = document.getElementById('table-map');
    map.innerHTML = ''; 
    const booked = JSON.parse(localStorage.getItem('rp_bookings')) || [];

    for (let i = 1; i <= 12; i++) {
        const table = document.createElement('div');
        if (booked.includes(i)) {
            table.className = 'table-unit taken';
            table.innerText = `Table ${i}\n(Booked)`;
        } else {
            table.className = 'table-unit';
            table.innerText = `Table ${i}`;
            table.onclick = () => handleAction('bookTable', i);
        }
        map.appendChild(table);
    }
}

function bookTable(id) {
    if(confirm(`Book Table ${id}?`)) {
        let booked = JSON.parse(localStorage.getItem('rp_bookings')) || [];
        booked.push(id);
        localStorage.setItem('rp_bookings', JSON.stringify(booked));
        renderTables();
        updateAdminView();
    }
}

function updateAdminView() {
    const panel = document.getElementById('admin-table-controls');
    panel.innerHTML = '';
    const booked = JSON.parse(localStorage.getItem('rp_bookings')) || [];

    if (booked.length === 0) {
        panel.innerHTML = "<p>No active reservations to manage.</p>";
        return;
    }

    booked.forEach(id => {
        const btn = document.createElement('button');
        btn.className = 'free-btn';
        btn.innerText = `Release Table ${id}`;
        btn.onclick = () => freeTable(id);
        panel.appendChild(btn);
    });
}

function freeTable(id) {
    if(confirm(`Release Table ${id}?`)) {
        let booked = JSON.parse(localStorage.getItem('rp_bookings')) || [];
        booked = booked.filter(tableId => tableId !== id);
        localStorage.setItem('rp_bookings', JSON.stringify(booked));
        renderTables();
        updateAdminView();
    }
}
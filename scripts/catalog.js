let allProducts = [];
let currentCategory = 'coffee';
let showAllCards = false;

function createCardHTML(product) {
    return `
        <div class="item-box" data-name="${product.name}">
            <div class="item-img-frame">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item-text-block">
                <h2 class="item-name">${product.name}</h2>
                <div class="item-description">
                    <p>${product.description}</p>
                </div>
                <p class="item-price">$${product.price}</p>
            </div>
        </div>
    `;
}

function renderCards(products) {
    const rowGroup1 = document.getElementById('rowGroup1');
    const rowGroup2 = document.getElementById('rowGroup2');

    if (products.length <= 4) {
        rowGroup1.innerHTML = products.map(createCardHTML).join('');
        rowGroup2.innerHTML = '';
        return;
    }

    const half = Math.ceil(products.length / 2);
    const firstHalf = products.slice(0, half);
    const secondHalf = products.slice(half);

    rowGroup1.innerHTML = firstHalf.map(createCardHTML).join('');
    rowGroup2.innerHTML = secondHalf.map(createCardHTML).join('');
}

function isMobile() {
    return window.innerWidth <= 768;
}

function updateCardsVisibility() {
    const cards = document.querySelectorAll('#rowGroup1 .item-box, #rowGroup2 .item-box');
    const btnBox = document.querySelector('.refresh-btn-box');

    if (!isMobile() || cards.length <= 4) {
        cards.forEach(card => card.classList.remove('hidden-card'));
        btnBox.style.display = 'none';
        return;
    }

    cards.forEach((card, index) => {
        if (index < 4 || showAllCards) {
            card.classList.remove('hidden-card');
        } else {
            card.classList.add('hidden-card');
        }
    });

    btnBox.style.display = showAllCards ? 'none' : 'flex';
}

function showCategory(category) {
    currentCategory = category;
    showAllCards = false;
    const filtered = allProducts.filter(p => p.category === category);
    renderCards(filtered);
    updateCardsVisibility();
}

function initTabs() {
    const tabs = document.querySelectorAll('.tabs .btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            tabs.forEach(t => {
                t.classList.remove('active');
                t.querySelector('.circle').classList.remove('active');
                t.querySelector('.tab-btn-name').classList.remove('active');
            });

            tab.classList.add('active');
            tab.querySelector('.circle').classList.add('active');
            tab.querySelector('.tab-btn-name').classList.add('active');

            showCategory(category);
        });
    });
}

function initShowMoreButton() {
    const refreshBtn = document.querySelector('.refresh-btn');

    refreshBtn.addEventListener('click', () => {
        showAllCards = true;
        updateCardsVisibility();
    });
}

window.addEventListener('resize', updateCardsVisibility);

fetch('./products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        initTabs();
        initShowMoreButton();
        showCategory('coffee');
    })
    .catch(error => console.error('Failed to load products:', error));

/* MODAL ============================================================ */

const modal = document.querySelector('.modal');
const modContainer = document.querySelector('.modal-container');
const assortmentContainer = document.querySelector('.assortment-big-container');

let selectedSizeKey = 's';
let selectedAdditives = [];

function findProductByName(name) {
    return allProducts.find(p => p.name === name);
}

function calculateTotalPrice(product) {
    let total = Number(product.price);
    total += Number(product.sizes[selectedSizeKey]['add-price']);
    selectedAdditives.forEach(additiveName => {
        const additive = product.additives.find(a => a.name === additiveName);
        if (additive) {
            total += Number(additive['add-price']);
        }
    });
    return total.toFixed(2);
}

function updateTotalPriceDisplay(product) {
    const totalPriceBox = modContainer.querySelector('.mod-total-price');
    totalPriceBox.textContent = `$${calculateTotalPrice(product)}`;
}

function createSizeButtonsHTML(product) {
    return Object.entries(product.sizes).map(([key, value]) => `
        <div class="mod-size-btn${key === selectedSizeKey ? ' active' : ''}" data-size="${key}">
            <span class="mod-size-letter">${key.toUpperCase()}</span>
            <span class="mode-size-ml">${value.size}</span>
        </div>
    `).join('');
}

function createAdditiveButtonsHTML(product) {
    return product.additives.map((additive, index) => `
        <div class="mod-additive-btn" data-additive="${additive.name}">
            <span class="mod-addit-number">${index + 1}</span>
            <span class="mode-addit-info">${additive.name}</span>
        </div>
    `).join('');
}

function openModal(productName) {
    const product = findProductByName(productName);
    if (!product) return;

    selectedSizeKey = 's';
    selectedAdditives = [];

    modContainer.innerHTML = `
        <div class="mod-first-colmn">
            <div class="mod-img-box">
                <img class="mod-img" src="${product.image}" alt="${product.name}">
            </div>
        </div>
        <div class="mod-second-colmn">
            <div class="mod-item-info-box">
                <h2 class="mod-item-name">${product.name}</h2>
                <p class="mod-item-description">${product.description}</p>
            </div>
            <div class="mod-size-box">
                <p class="mod-size">Size</p>
                <div class="mod-sizes-buttons">
                    ${createSizeButtonsHTML(product)}
                </div>
            </div>
            <div class="mod-additives-box">
                <p class="mod-additive">Additives</p>
                <div class="mod-additives-buttons">
                    ${createAdditiveButtonsHTML(product)}
                </div>
            </div>
            <div class="mod-total">
                <p class="mod-total-name">Total:</p>
                <p class="mod-total-price">$${calculateTotalPrice(product)}</p>
            </div>
            <div class="mod-warning">
                <svg class="mod-warning-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7.66663V11" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 5.00667L8.00667 4.99926" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00004C14.6666 4.31814 11.6818 1.33337 7.99992 1.33337C4.31802 1.33337 1.33325 4.31814 1.33325 8.00004C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="mod-warning-text">The cost is not final. Download our mobile app to see the final price and place your order.</p>
            </div>
            <button class="mod-close-btn" type="button">Close</button>
        </div>
    `;

    const sizeButtons = modContainer.querySelectorAll('.mod-size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSizeKey = btn.dataset.size;
            updateTotalPriceDisplay(product);
        });
    });

    const additiveButtons = modContainer.querySelectorAll('.mod-additive-btn');
    additiveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const additiveName = btn.dataset.additive;
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                selectedAdditives.push(additiveName);
            } else {
                selectedAdditives = selectedAdditives.filter(name => name !== additiveName);
            }
            updateTotalPriceDisplay(product);
        });
    });

    modContainer.querySelector('.mod-close-btn').addEventListener('click', closeModal);

    modal.classList.add('active');
    document.body.classList.add('disable-scroll');
}

function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('disable-scroll');
}

assortmentContainer.addEventListener('click', (event) => {
    const card = event.target.closest('.item-box');
    if (!card) return;
    openModal(card.dataset.name);
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});
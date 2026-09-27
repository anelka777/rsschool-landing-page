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
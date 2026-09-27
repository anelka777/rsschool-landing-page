let allProducts = [];
let currentCategory = 'coffee';

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

function showCategory(category) {
    currentCategory = category;
    const filtered = allProducts.filter(p => p.category === category);
    renderCards(filtered);
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

fetch('./products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data;
        initTabs();
        showCategory('coffee');
    })
    .catch(error => console.error('Failed to load products:', error));
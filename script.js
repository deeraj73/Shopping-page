const api_url = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"; 

async function getProducts(url, category) {
    const response = await fetch(url);

    const data = await response.json();

    if (response.ok) {
        hideloader(category);
        showCategoryProducts(data.categories.find(cat => cat.category_name.toLowerCase() === category), category + "-products");
    } else {
        console.error('Error fetching data:', response.statusText);
    }
}

function hideloader(category) {
    document.getElementById('loading-' + category).style.display = 'none';
}

function showCategoryProducts(category, containerId) {
    let categoryContainer = document.getElementById(containerId);
    let categoryHtml = '';

    category.category_products.slice(0, 4).forEach(product => {
        const titleWords = product.title.split(' ');
        let truncatedTitle = titleWords.slice(0, 2).join(' ');

        if (titleWords.length > 2) {
            truncatedTitle += '.';
        }

        categoryHtml += `
        <div class="product">
            <img src="${product.image}" alt="${product.title}">
            ${product.badge_text ? `<span class="discount-tag">${product.badge_text}</span>` : ''}                
            <span class="title-container">
                <h2 class="truncated-title">${truncatedTitle}</h2>
                <h2 class="full-title" style="display:none;">${product.title}</h2>
            </span>
            ${product.vendor}
            <p>$${product.price} <del>${product.compare_at_price}</del > <p class="red-text">50% Off</p></p>
            <button class="add-to-cart"><b>Add to Cart</b></button>
        </div>
        `;
    });

    categoryContainer.innerHTML = categoryHtml;

    document.querySelectorAll('.truncated-title').forEach(title => {
        title.addEventListener('click', function() {
            const fullTitle = this.parentElement.querySelector('.full-title');
            if (fullTitle.style.display === 'none') {
                this.style.display = 'none';
                fullTitle.style.display = 'block';
            } else {
                this.style.display = 'block';
                fullTitle.style.display = 'none';
            }
        });
    });
}

document.querySelectorAll('.tab a').forEach(tab => {
    tab.addEventListener('click', function() {
        const category = this.innerText.toLowerCase();
        document.querySelectorAll('.tab a').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.products').forEach(productList => productList.style.display = 'none');
        document.getElementById(category + '-products').style.display = 'flex';

        // Hide the products if Women or Kids tab is clicked
        if (category === 'women') {
            document.getElementById('men-products').style.display = 'none';
            document.getElementById('kids-products').style.display = 'none';
            getProducts(api_url, "women");
        } else if (category === 'kids') {
            document.getElementById('men-products').style.display = 'none';
            document.getElementById('women-products').style.display = 'none';
            getProducts(api_url, "kids");
        } else {
            document.getElementById('women-products').style.display = 'none';
            document.getElementById('kids-products').style.display = 'none';
            getProducts(api_url, "men");
        }
    });
});

getProducts(api_url, "men");

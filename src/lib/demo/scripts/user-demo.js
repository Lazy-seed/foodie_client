export const userDemoSteps = [
    { action: 'navigate', value: '/' },
    { action: 'wait', delay: 1000 },
    { action: 'click', selector: '[data-demo="category-Burgers"]', delay: 500 },
    { action: 'wait', delay: 1000 },
    // Select the first product add button
    { action: 'click', selector: '[data-demo^="product-1-add"]', delay: 500 },
    { action: 'click', selector: '[data-demo^="product-4-add"]', delay: 500 },
    { action: 'click', selector: '[data-demo^="product-7-add"]', delay: 500 },
    { action: 'wait', delay: 500 },
    { action: 'click', selector: '[data-demo="cart-icon"]', delay: 500 },
    { action: 'wait', delay: 1000 },
    { action: 'click', selector: '[data-demo="checkout-btn"]', delay: 500 },
    { action: 'wait', delay: 1000 },
    { action: 'click', selector: '[data-demo="place-order-btn"]', delay: 500 },
    { action: 'simulatePayment', delay: 1000 },
    { action: 'wait', delay: 2000 },
];

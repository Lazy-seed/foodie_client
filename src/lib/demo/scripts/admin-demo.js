export const adminDemoSteps = [
    { action: 'navigate', value: '/admin' },
    { action: 'wait', delay: 1000 },
    { action: 'click', selector: '[data-demo="orders-link"]', delay: 500 },
    { action: 'wait', delay: 1000 },
    // Select the first order view button
    { action: 'click', selector: '[data-demo^="order-"][data-demo$="-view"]', delay: 500 },
    { action: 'wait', delay: 1000 },
    // Select the status dropdown for the same order (assuming it's visible in the modal or row)
    // If view opens a modal, we might need to target elements inside it.
    // But based on the code, "View" button just logs or does nothing visible in the table row?
    // Wait, the "View" button in Orders.jsx doesn't seem to open anything in the provided code:
    // <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1"> <Eye size={16} /> View </button>
    // It has no onClick handler!
    // So clicking it won't do anything.
    // The status dropdown IS in the row.
    // So we can just click the status dropdown.

    { action: 'click', selector: '[data-demo^="order-"][data-demo$="-status"]', delay: 500 },
    { action: 'wait', delay: 500 },
    { action: 'fill', selector: '[data-demo^="order-"][data-demo$="-status"]', value: 'processing' },
    { action: 'wait', delay: 2000 },
    { action: 'fill', selector: '[data-demo^="order-"][data-demo$="-status"]', value: 'out_for_delivery' },
    { action: 'wait', delay: 2000 },
    { action: 'fill', selector: '[data-demo^="order-"][data-demo$="-status"]', value: 'delivered' },
    { action: 'wait', delay: 2000 },
];

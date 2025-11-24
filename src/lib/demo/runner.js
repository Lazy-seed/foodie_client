import { toast } from 'react-hot-toast';

export class DemoRunner {
    constructor(steps, options = {}) {
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isPlaying = false;
        this.speed = 1;
        this.onStepChange = options.onStepChange || (() => { });
        this.onComplete = options.onComplete || (() => { });
        this.onStop = options.onStop || (() => { });
        this.navigate = options.navigate || ((url) => { window.location.href = url; });
        this.abortController = null;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.abortController = new AbortController();
        this.run();
    }

    pause() {
        this.isPlaying = false;
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    stop() {
        this.isPlaying = false;
        this.currentStepIndex = 0;
        if (this.abortController) {
            this.abortController.abort();
        }
        this.removeHighlight();
        this.onStop();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    async run() {
        while (this.currentStepIndex < this.steps.length && this.isPlaying) {
            const step = this.steps[this.currentStepIndex];
            this.onStepChange(this.currentStepIndex, step);

            try {
                await this.executeStep(step);
                this.currentStepIndex++;
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Demo aborted');
                    return;
                }
                console.error('Demo step failed:', error);
                toast.error(`Demo step failed: ${error.message}`);
                this.pause();
                return;
            }
        }

        if (this.currentStepIndex >= this.steps.length) {
            this.isPlaying = false;
            this.onComplete();
        }
    }

    async executeStep(step) {
        const { action, selector, value, delay = 0 } = step;
        const adjustedDelay = delay / this.speed;

        // Wait before action
        await this.wait(adjustedDelay);

        if (action === 'wait') {
            return;
        }

        if (selector) {
            await this.highlightElement(selector);
        }

        switch (action) {
            case 'navigate':
                this.navigate(value);
                break;
            case 'click':
                this.clickElement(selector);
                break;
            case 'fill':
                this.fillElement(selector, value);
                break;
            case 'simulatePayment':
                await this.simulatePayment();
                break;
            case 'updateStatus':
                await this.updateStatus(step.orderId, step.status);
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }

        // Wait after action (optional, for visual pacing)
        await this.wait(500 / this.speed);
    }

    async highlightElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add highlight class
        this.removeHighlight();
        element.classList.add('demo-highlight');

        // Add tooltip/microcopy if needed
        // This could be handled by a React component listening to onStepChange
    }

    removeHighlight() {
        const existing = document.querySelector('.demo-highlight');
        if (existing) {
            existing.classList.remove('demo-highlight');
        }
    }

    clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
        }
    }

    fillElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    async simulatePayment() {
        // Mock payment delay
        await this.wait(2000 / this.speed);
        toast.success('Payment Simulated Successfully');
    }

    async updateStatus(orderId, status) {
        // Call API to update status
        // This assumes we have an API client or fetch available
        // For now, just mock the delay and toast
        await this.wait(1000 / this.speed);
        toast.success(`Order status updated to ${status}`);
    }

    wait(ms) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, ms);
            if (this.abortController) {
                this.abortController.signal.addEventListener('abort', () => {
                    clearTimeout(timeout);
                    reject(new DOMException('Aborted', 'AbortError'));
                });
            }
        });
    }
}

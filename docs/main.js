import { manager } from './manager.js';
class StateStatusTracker extends HTMLElement {
    constructor() {
        super();
        this.handleStateUpdate = (e) => {
            const state = e.detail.state;
            if (state.active) {
                this._statusDisplay.innerText = 'Active';
                this._statusDisplay.style.color = '#1e90ff';
            }
            else {
                this._statusDisplay.innerText = 'Inactive';
                this._statusDisplay.style.color = '#daa520';
            }
            if (state.secondary) {
                this._secondaryStatusDisplay.innerText = 'Active';
                this._secondaryStatusDisplay.style.color = '#1e90ff';
            }
            else {
                this._secondaryStatusDisplay.innerText = 'Inactive';
                this._secondaryStatusDisplay.style.color = '#daa520';
            }
        };
        this._statusDisplay = this.querySelector('state-status');
        this._secondaryStatusDisplay = this.querySelector('secondary-state-status');
    }
    connectedCallback() {
        document.addEventListener('manager:update', this.handleStateUpdate);
    }
}
customElements.define('state-status-tracker', StateStatusTracker);
class ManualToggleButton extends HTMLElement {
    constructor() {
        super(...arguments);
        this.handleClickEvent = () => {
            manager.toggleState();
        };
    }
    connectedCallback() {
        this.addEventListener('click', this.handleClickEvent);
    }
}
customElements.define('manual-toggle-button', ManualToggleButton);
class DynamicOptions extends HTMLElement {
    constructor() {
        super();
        this.handleOptionChangeEvent = (e) => {
            const target = e.currentTarget;
            const index = parseInt(target.value);
            manager.updateObjectArrayState(index, target.checked);
        };
        this._options = Array.from(this.querySelectorAll('input'));
    }
    connectedCallback() {
        for (let i = 0; i < this._options.length; i++) {
            this._options[i].addEventListener('change', this.handleOptionChangeEvent);
        }
    }
}
customElements.define('dynamic-options', DynamicOptions);
class DeepUpdates extends HTMLElement {
    constructor() {
        super();
        this.handleInputChangeEvent = () => {
            let value = parseInt(this._input.value);
            if (value === NaN) {
                value = 0;
                this._input.value = '0';
            }
            manager.updateDeepState(value);
        };
        this.handleStateUpdate = (e) => {
            const state = e.detail.state;
            this._deepDisplay.innerText = state.deep.b.bb;
        };
        this._input = this.querySelector('input');
        this._deepDisplay = this.querySelector('deep-two');
    }
    connectedCallback() {
        this._input.addEventListener('change', this.handleInputChangeEvent);
        document.addEventListener('manager:update', this.handleStateUpdate);
    }
}
customElements.define('deep-updates', DeepUpdates);

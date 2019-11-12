import { manager } from './manager.js';

class StateStatusTracker extends HTMLElement
{
    private _statusDisplay : HTMLElement;
    private _secondaryStatusDisplay : HTMLElement;

    constructor()
    {
        super();
        this._statusDisplay = this.querySelector('state-status');
        this._secondaryStatusDisplay = this.querySelector('secondary-state-status');
    }

    private handleStateUpdate:EventListener = (e:CustomEvent) => {
        const state = e.detail.state;
        if (state.active)
        {
            this._statusDisplay.innerText = 'Active';
            this._statusDisplay.style.color = '#1e90ff';
        }
        else
        {
            this._statusDisplay.innerText = 'Inactive';
            this._statusDisplay.style.color = '#daa520';
        }

        if (state.secondary)
        {
            this._secondaryStatusDisplay.innerText = 'Active';
            this._secondaryStatusDisplay.style.color = '#1e90ff';
        }
        else
        {
            this._secondaryStatusDisplay.innerText = 'Inactive';
            this._secondaryStatusDisplay.style.color = '#daa520';
        }
    }

    connectedCallback()
    {
        document.addEventListener('manager:update', this.handleStateUpdate);
    }
}
customElements.define('state-status-tracker', StateStatusTracker);

class ManualToggleButton extends HTMLElement
{
    private handleClickEvent:EventListener = () => {
        manager.toggleState();
    }

    connectedCallback()
    {
        this.addEventListener('click', this.handleClickEvent);
    }
}
customElements.define('manual-toggle-button', ManualToggleButton);

class DynamicOptions extends HTMLElement
{
    private _options : Array<HTMLInputElement>;

    constructor()
    {
        super();
        this._options = Array.from(this.querySelectorAll('input'));
    }

    private handleOptionChangeEvent:EventListener = (e:Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const index = parseInt(target.value);
        manager.updateObjectArrayState(index, target.checked);
    }

    connectedCallback()
    {
        for (let i = 0; i < this._options.length; i++)
        {
            this._options[i].addEventListener('change', this.handleOptionChangeEvent);
        }
    }
}
customElements.define('dynamic-options', DynamicOptions);

class DeepUpdates extends HTMLElement
{
    private _input : HTMLInputElement;
    private _deepDisplay : HTMLElement;

    constructor()
    {
        super();
        this._input = this.querySelector('input');
        this._deepDisplay = this.querySelector('deep-two');
    }
    
    private handleInputChangeEvent:EventListener = () => {
        let value = parseInt(this._input.value);
        if (value === NaN)
        {
            value = 0;
            this._input.value = '0';
        }
        manager.updateDeepState(value);
    }

    private handleStateUpdate:EventListener = (e:CustomEvent) => {
        const state = e.detail.state;
        this._deepDisplay.innerText = state.deep.b.bb;
    }

    connectedCallback()
    {
        this._input.addEventListener('change', this.handleInputChangeEvent);
        document.addEventListener('manager:update', this.handleStateUpdate);
    }
}
customElements.define('deep-updates', DeepUpdates);
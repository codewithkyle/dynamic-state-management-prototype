class Manager {
    constructor() {
        this.state = {
            active: false,
            secondary: false,
            options: [
                {
                    value: 'Foo',
                    active: false,
                },
                {
                    value: 'Bar',
                    active: false,
                },
                {
                    value: 'Baz',
                    active: false,
                }
            ],
            deep: {
                a: {
                    ab: {
                        abc: 0
                    }
                },
                b: {
                    bb: 0
                }
            }
        };
        this.delayedUpdate();
        this.delayedDeepState();
    }
    delayedUpdate() {
        const updatedState = {};
        setTimeout(() => {
            updatedState.active = (this.state.active) ? false : true;
            this.setState(updatedState);
            this.delayedUpdate();
        }, 5000);
    }
    delayedDeepState() {
        const updatedState = { deep: this.state.deep };
        setTimeout(() => {
            updatedState.deep.b.bb = this.state.deep.b.bb + 1;
            this.setState(updatedState);
            this.delayedDeepState();
        }, 2500);
    }
    toggleState() {
        const updatedState = {};
        updatedState.secondary = (this.state.secondary) ? false : true;
        this.setState(updatedState);
    }
    updateObjectArrayState(index, value) {
        const updatedState = { options: this.state.options };
        updatedState.options[index].active = value;
        console.log(`${updatedState.options[index].value} status was changed to ${value}`);
        this.setState(updatedState);
    }
    updateDeepState(value) {
        const updatedState = { deep: this.state.deep };
        updatedState.deep.a.ab.abc = value;
        this.setState(updatedState);
    }
    setState(updatedState) {
        const postUpdatedState = Object.assign(this.state, updatedState);
        const event = new CustomEvent('manager:update', { detail: { state: postUpdatedState } });
        document.dispatchEvent(event);
        console.log('Updated state:', postUpdatedState);
    }
}
export const manager = new Manager();

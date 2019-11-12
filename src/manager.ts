interface Option
{
    active: boolean,
    value: string,
}

interface ManagerState
{
    active: boolean,
    secondary: boolean,
    options: Array<Option>,
    deep: {
        a: {
            ab: {
                abc: number
            }
        },
        b: {
            bb: number
        }
    }
}

class Manager
{
    private state : ManagerState;

    constructor()
    {
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
            deep:
            {
                a:
                {
                    ab:
                    {
                        abc: 0
                    }
                },
                b:
                {
                    bb: 0
                }
            }
        };
        this.delayedUpdate();
        this.delayedDeepState();
    }

    private delayedUpdate()
    {
        const updatedState:Partial<ManagerState> = {};
        setTimeout(() => {
            updatedState.active = (this.state.active) ? false : true;
            this.setState(updatedState);
            this.delayedUpdate();
        }, 5000);
    }

    private delayedDeepState()
    {
        const updatedState:Partial<ManagerState> = { deep: this.state.deep };
        setTimeout(() => {
            updatedState.deep.b.bb = this.state.deep.b.bb + 1;
            this.setState(updatedState);
            this.delayedDeepState();
        }, 2500);
    }

    public toggleState()
    {
        const updatedState:Partial<ManagerState> = {};
        updatedState.secondary = (this.state.secondary) ? false : true;
        this.setState(updatedState);
    }

    public updateObjectArrayState(index:number, value:boolean)
    {
        const updatedState:Partial<ManagerState> = { options: this.state.options };
        updatedState.options[index].active = value;
        console.log(`${ updatedState.options[index].value } status was changed to ${ value }`);
        this.setState(updatedState);
    }

    public updateDeepState(value:number)
    {
        const updatedState:Partial<ManagerState> = { deep: this.state.deep };
        updatedState.deep.a.ab.abc = value;
        this.setState(updatedState);
    }

    private setState(updatedState:Partial<ManagerState>)
    {
        const postUpdatedState = Object.assign(this.state, updatedState);
        const event = new CustomEvent('manager:update', { detail: { state: postUpdatedState } });
        document.dispatchEvent(event);
        console.log('Updated state:', postUpdatedState);
    }
}

export const manager:Manager = new Manager();
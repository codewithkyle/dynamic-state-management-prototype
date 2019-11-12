# Dynamic State Management

The goal of this prototype is to explore the possibility of utilizing [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) for managing a state object.

## Previous Attempts / Alternative Options

### Spread Syntax

One alternative would be to create an instance of the current state using the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). It could be used as follows:

```typescript
updateState(newValue:number) : void
{
    const updatedState = { ...this.state };
    updatedState.value = newValue;
    this.setState(updatedState);
}

setState(updatedState:CustomState) : void
{
    this.state = updatedState;
}
```

The problem with this method is that it's not asynchronous. If two methods are called and one or both are performed asynchronously the instance of the state object will be stale when it's updated. An example of this is when a cart state manager handles the status of the cart drawer along with the line items within the cart. If the user toggles the drawer open and the line items are requested when the line items arrive the state for the cart's open status could be stale and the cart would "update" to be closed when the user intended for the cart to be open. See the example below.

```typescript
toggleCart() : void
{
    const updatedState = { ...this.state };
    updatedState.open = (updatedState.open) ? false : true;

    if (updatedState.open)
    {
        this.getLineItems();
    }

    this.setState(updatedState);
}

async getLineItems() : Promise<string>
{
    try
    {
        const updatedState = { ...this.state };
        const request = await fetch('line-items.json');
        if (request.ok)
        {
            const response = await request.json();
            updatedState.lineItems = response.data;
            this.setState(updatedState);
            return;
        }
        else
        {
            throw `Failed to fetch line items. Server responded with: ${ request.status }:${ request.statusText }`;
        }
    }
    catch (error)
    {
        throw error;
    }
}

setState(updatedState:CustomState) : void
{
    this.state = updatedState;
}
```

### Dynamic Key/Value Pair Updating

Another option is to dynamically update key/value pairs. If the key doesn't exist on the state object the key is added. It could be used as follows:

```typescript
setState(updatedState:Partial<CustomState>) : void
{
    Object.keys(updatedState).forEach((key:string) => {
        if (this.state[key] !== null && this.state[key] !== undefined)
        {
            if (updatedState[key] !== this.state[key])
            {
                this.state[key] = updatedState[key];
            }
        }
        else
        {
            this.state[key] = updatedState[key];
        }
    });
}
```

This problem with this method is that it doesn't easily handle recursive or nested values. For example, if a value within an object that's in an array needs to change the entire array will need to be updated/rebuilt. It also doesn't handle nested objects without having to rebuild the entire object.

## Proposed Solution

Using [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). The changes within the partial object (`updatedState`) will be assigned to the target object (`this.state`) and an instance of the state object will be created as a result. The instance can then be dispatched in a custom event allowing other parts of the application to react to the state changes.

```typescript
setState(updatedState:Partial<CustomState>)
{
    const postUpdatedState = Object.assign(this.state, updatedState);
    const event = new CustomEvent('state:update', { detail: { state: postUpdatedState } });
    document.dispatchEvent(event);
}
```
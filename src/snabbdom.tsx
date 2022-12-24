import {
    Fragment,
    jsx,
    VNode,
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

const stateSymbol = Symbol("_state_");

const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

class CelerityComponent {
    constructor(initialState = {}) {
        this.state = initialState;
    }

    render() {}

    componentDidMount() {}

    componentDestroyed() {}

    setState(newState) {
        this.state = newState;
        this.updateState();
    }

    updateState() {
        this._vNode = patch(this._vNode, this.render(this.props));
    }
}

CelerityComponent.prototype.isClassComponent = true;

const Celerity = {
    createElement: function (type, props, ...children) {
        let element;
        if (type.prototype && type.prototype.isClassComponent) {
            let initialState = null;
            let initialProps = {};
            for (key in props) {
                if (key === "state") {
                    initialState = props[key];
                } else {
                    initialProps[key] = props[key];
                }
            }
            const componentInstance = new type(initialState);
            componentInstance.props = initialProps;
            element = componentInstance.render(initialProps);
            componentInstance._vNode = element;
            componentInstance._vNode.data.hook = {
                insert: (vnode) => {
                    componentInstance.componentDidMount(vnode);
                },
                destroy: (vnode) => {
                    componentInstance.componentDestroyed(vnode);
                },
            };
        } else if (type instanceof Function) {
            element = type(props);
        } else {
            element = h(type, props, children);
        }
        return element;
    },

    render: function (node, container) {
        patch(container, node);
    },
};

export { Celerity, CelerityComponent };

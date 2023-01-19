import { Celerity, CelerityComponent } from "../../src/index";

class Route extends CelerityComponent {
    render(props, children) {
        console.log("Props.com", props.component, children);
        const path = window.location.pathname.trim();
        return <div>{this.props.path == path ? props.component : null}</div>;
    }

    componentDidMount() {
        console.log("Route component mounted");
    }
}

class Router extends CelerityComponent {
    render(props, children) {
        debugger;
        return <div>{children}</div>;
    }

    componentDidMount() {
        console.log("Router component mounted", this._vNode);
        (function (t) {
            function cb(e) {
                debugger;
                //t.updateState();
                console.log("*@#$@#0000", t._vNode);
            }
            window.addEventListener("popstate", cb);
        })(this);
    }
}

class App extends CelerityComponent {
    render(props) {
        return (
            <div>
                <h1>Hello</h1>
            </div>
        );
    }

    componentDidMount(vnode) {
        console.log("Component mounted", vnode);
    }
}

export { Route, Router };

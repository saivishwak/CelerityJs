import { Celerity, CelerityComponent } from "../../src/index.tsx";

class Route extends CelerityComponent {
    render(props, children) {
        console.log("Props.com", props.component, children);
        const path = window.location.pathname.trim();
        return (
            <div>
                {this.props.path == path ? props.component : null}
            </div>
        );
    }

    componentDidMount() {
        console.log("Route component mounted");
    }
}

class Router extends CelerityComponent {
    render(props, children) {
        return <div>{children}</div>;
    }

    componentDidMount() {
        console.log("Router component mounted", this._vNode);
        (function (t) {
            function cb(e) {
                debugger;
                if (t._parent){
                    t._parent.render();
                }
                console.log("*@#$@#0000",t._vNode);
            }
            window.addEventListener("popstate", cb);
        })(this);
    }
}

export { Route, Router };

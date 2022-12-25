import { Celerity, CelerityComponent } from "../../src/index.tsx";
import { Route, Router } from "./route.tsx";

class H extends CelerityComponent {
    render(props) {
        const decrement = () => {
            const oldVal = this.state.count;
            this.setState({
                ...this.state,
                count: oldVal - 1,
            });

            history.pushState(null, "", "/123");
            window.dispatchEvent(new Event("popstate"));
        };

        return (
            <div>
                <h1>{props.title}</h1>
                <h2>Dec: {this.state.count} </h2>
                <button on={{ click: decrement }}>click 2</button>
                <button on={{ click: props.click }}>ParentClick</button>
                <p>{props.count}</p>
            </div>
        );
    }

    componentDestroyed(vnode) {
        console.log("Component destroyed", vnode);
    }

    componentDidMount(vnode) {
        console.log("H component loaded", vnode);
    }
}

class App extends CelerityComponent {
    render(props) {
        const increment = () => {
            const oldCount = this.state.count;
            this.setState({
                ...this.state,
                count: oldCount + 1,
            });
        };

        const parentClick = () => {
            const oldCount = this.state.count;
            this.setState({
                ...this.state,
                count: oldCount - 1,
            });
        };

        return (
            <div>
                <h1>{this.state.count}</h1>
                <button on={{ click: increment }}>Click</button>
                <H
                    state={{ title: "Hello", count: 100 }}
                    click={parentClick}
                    title="hello"
                    count={this.state.count}
                />
                {this.state.count % 2 == 0 ? <h1>Wohooo</h1> : null}
            </div>
        );
    }

    componentDidMount(vnode) {
        console.log("Component mounted", vnode);
    }
}

class Test extends CelerityComponent {
    render(props) {
        return <h1>test</h1>;
    }
}

{
    /*<Route path="/" component={<App state={{ count: 0 }} title="he" />} />
    <Route path="/123" component={<H state={{ count: 0, title:"route" }} title="route he" count={100} />} />*/
}

{
    /*<Route path="/" component={<Test />} />*/
}

const root = document.getElementById("root");
Celerity.render(
    <Router>
        <Route path="/" component={<App state={{ count: 0 }} title="he" />} />
        <Route
            path="/123"
            component={
                <H
                    state={{ count: 0, title: "route" }}
                    title="route he"
                    count={100}
                />
            }
        />
    </Router>,
    root
);

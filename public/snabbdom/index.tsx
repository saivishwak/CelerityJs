import { Celerity, CelerityComponent } from "../../src/index.tsx";

class H extends CelerityComponent {
    render() {
        const decrement = () => {
            const oldVal = this.state.count;
            this.setState({
                ...this.state,
                count: oldVal - 1,
            });
        };

        return (
            <div>
                <h1>{this.state.title}</h1>
                <h2>Dec: {this.state.count} </h2>
                <button on={{ click: decrement }}>click 2</button>
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
    render() {
        const increment = () => {
            const oldCount = this.state.count;
            this.setState({
                ...this.state,
                count: oldCount + 1,
            });
        };
        return (
            <div>
                {/*<H title="Hello" count={100} />*/}
                <h1>{this.state.count}</h1>
                <button on={{ click: increment }}>Click</button>
                {this.state.count == 2 ? <H title="Hello" count={100} /> : null}
            </div>
        );
    }

    componentDidMount(vnode) {
        console.log("Component mounted", vnode);
    }
}

const root = document.getElementById("root");
Celerity.render(<App count={0} />, root);

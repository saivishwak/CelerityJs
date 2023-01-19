import { Celerity, CelerityComponent, createComponent } from "../../src/index";
import { h } from "snabbdom";

class App extends CelerityComponent {
    render(props) {
        return (
            <div>
                <h1>Hello World!</h1>
            </div>
        );
    }

    componentDidMount(vnode) {
        console.log("Component mounted", vnode);
    }
}

const root = document.getElementById("root");
Celerity.render(<App />, root);

import Celerity from "../src/index.tsx";
import "./index.css";
import Comp1 from "./comp1.tsx";

const App = () => {
    const click = () => {
        console.log("Button clicked");
    };
    const counter = 0;

    return (
        <div className="app">
            <h1>Counter</h1>
            <h2>{counter}</h2>
            <span>World</span>
            <button onClick={click}>Click</button>
            <Comp1 />
        </div>
    );
};

const root = document.getElementById("root");
console.log(App() as FrameworkInterface);
Celerity.render(App() as FrameworkInterface, root);

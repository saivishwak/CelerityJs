import { Celerity, useState } from "../src/index.tsx";
import "./index.css";
import Comp1 from "./comp1.tsx";

const App = () => {
    const [counter, setCounter] = useState(0);
    const click = () => {
        console.log("Button clicked");
        setCounter(counter + 1);
    };

    return (
        <div className="app">
            <h1>Counter</h1>
            <h2>{counter}</h2>
            <button onClick={click}>Click</button>
            <Comp1 data={{title:"hello"}}/>
        </div>
    );
};

const root = document.getElementById("root");
Celerity.render(<App />, root);

import { Celerity, useState, useSnabState } from "../src/index.tsx";
import "./index.css";
import Comp1 from "./comp1.tsx";

const App = () => {
    const [counter, setCounter] = useState(0);
    const [title, setTitle] = useState("old title");
    const click = () => {
        console.log("Button clicked");
        setCounter(counter + 1);
    };

    return (
        <div className="app">
            <h1>Counter</h1>
            <h2>{counter}</h2>
            <h3>{title}</h3>
            <button onClick={click}>Click</button>
            <Comp1 data={{ title: "hello" }} setTitle={setTitle} />
        </div>
    );
};

const Greetings = ({ name }) => (
    <div>
        <h2>Greetings, {name}</h2>
    </div>
);

const App1 = () => {
    const [counter, setCounter] = useSnabState(0);
    return (
        <div>
            <h1 className="app">Hello</h1>
            <Greetings name={"Kitty"} />
        </div>
    );
};

const root = document.getElementById("root");
//Celerity.render(<App />, root);
//Celerity.render(Greetings("hello"), root);
Celerity.render(<App1 />, root);

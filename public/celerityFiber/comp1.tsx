import { Celerity, useState } from "../src/index.tsx";

export default function Comp1(props) {
    const title = props.data.title;
    const setTitle = props.setTitle;
    console.log("******PROPS",props);
    const [counter, setCounter] = useState(0);
    const click = () => {
        console.log("Button clicked");
        setCounter(counter + 1);
        debugger;
        setTitle("New Title");
    };
    return (
        <div>
            <h1>Comp1</h1>
            <p>{counter}</p>
            <p>{title}</p>
            <button onClick={click}>click2</button>
        </div>
    );
}

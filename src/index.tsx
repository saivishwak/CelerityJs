interface FrameworkInterface extends JSX.Element {
    tag: any;
}

const Celerity = {
    createElement: (
        tag: JSX.Element,
        props: any,
        ...children: any[]
    ): FrameworkInterface => {
        const element = {
            tag,
            type: tag.type,
            props: { ...props, children },
        };

        return element;
    },

    render: (element: FrameworkInterface, container: any): void => {
        console.log("Element", element);
        if (!element.tag) return;

        if (typeof element.tag == "function"){
            return Celerity.render(element.tag() as FrameworkInterface, container);
        }

        const dom = document.createElement(element.tag);
        const isEvent = (key) => key.startsWith("on");
        const isProperty = (key) => key !== "children";
        Object.keys(element.props)
            .filter(isProperty)
            .forEach((name) => {
                if (isEvent(name)) {
                    dom.addEventListener(
                        element.props[name].name,
                        element.props[name]
                    );
                } else {
                    dom[name] = element.props[name];
                }
            });
        element.props.children.forEach((child) => {
            if (typeof child !== "object") {
                const textNode = document.createTextNode(child);
                dom.appendChild(textNode);
            } else Celerity.render(child, dom);
        });
        container.appendChild(dom);
    },
};

export default Celerity;

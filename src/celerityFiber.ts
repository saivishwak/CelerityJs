import {
  h,
  propsModule,
  classModule,
  styleModule,
  init,
  eventListenersModule,
} from "snabbdom";

interface FrameworkInterface extends JSX.Element {
  tag: any;
}

//Remove this before production
if (!process.env.RUNTIME == "dev") {
  console.log = function (str) {
    //Do nothing
  };
}

const DEFAULT_RENDERER = "snabbdom";

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;
let wipFiber = null;
let hookIndex = null;

let snabVNode = null;

const reconcileSnabbdom = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

const Celerity = {
  createTextElement: (text: any): any => {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    };
  },

  createElement: (type: any, props: any, ...children: any[]) => {
    if (DEFAULT_RENDERER == "snabbdom") {
      console.log(type, props, children);
      let element;
      if (type instanceof Function) {
        element = type(props);
      } else {
        element = h(type, { props }, children);
      }
      return element;
    } else {
      const tag = type;
      const element = {
        tag,
        type: tag,
        props: {
          ...props,
          children: children.map((child) =>
            typeof child === "object"
              ? child
              : Celerity.createTextElement(child)
          ),
        },
      };
      return element;
    }

    return;
  },

  createDom: (fiber: any): any => {
    const dom =
      fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);
    return dom;
  },

  render: (element: any, container: any): void => {
    console.log("Render Function called");
    if (DEFAULT_RENDERER == "snabbdom") {
      if (snabVNode == null) {
        snabVNode = container;
      }
      snabVNode = reconcileSnabbdom(snabVNode, element);
      console.log(snabVNode);
    } else {
      wipRoot = {
        dom: container,
        props: {
          children: [element],
        },
        alternate: currentRoot,
      };

      nextUnitOfWork = wipRoot;
      deletions = [];
    }
  },
};

function updateFunctionalComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props) as FrameworkInterface];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = Celerity.createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function performUnitOfWork(fiber) {
  console.log("Unit of Work!!", fiber);

  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionalComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber: any, elements: any): void {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type == oldFiber.type;
    if (sameType) {
      //Update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE_NODE",
      };
    }

    if (element && !sameType) {
      //add new node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "NEW_NODE",
      };
    }

    if (oldFiber && !sameType) {
      //delete the node
      oldFiber.effectTag = "DELETE_NODE";
      deletions.push(oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function useState(initial) {
  debugger;
  console.log("OLD HOOOK", wipFiber, hookIndex);
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action;
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

function commitRoot(): void {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function updateDom(dom: any, prevProps: any, nextProps: any): void {
  // Update dom
  const isProperty = (key) => key !== "children";
  const isNew = (prev, next) => (key) => prev[key] !== next[key];
  const isGone = (prev, next) => (key) => !(key in next);
  const isEvent = (key) => key.startsWith("on");

  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps))
    .forEach((name) => {
      const eventType = prevProps[name].name;
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // remove existing properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  //Add new properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  //add new event Listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom.addEventListener(nextProps[name].name, nextProps[name]);
    });
}

function commitWork(fiber: any): void {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag == "NEW_NODE" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag == "UPDATE_NODE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag == "DELETE_NODE") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber: any, domParent: any): void {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

let snabStateMap = 0;

const useSnabState = (initialValue, oldNode = null) => {
  return [0, 0];
};

export { Celerity, useState, useSnabState };

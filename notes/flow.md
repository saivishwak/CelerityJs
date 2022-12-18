# Flow of the celerity Js

First the jsx vdom is sent render function
A complete vdom representation is made when ever possible (idle state)
once complete vnode is built the render happens on to the real dom.


## State management
When useState is called we save the initial state and oldHook representation
So when setState is called we call the rerender method
no again useState is called, where we look for oldHook and update the state value to new value from
hooks queue.

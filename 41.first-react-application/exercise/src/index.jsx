import './style.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = createRoot(document.querySelector('#root'))

const toto = 'there'

root.render(
    // Only one root child in render element
    // This enmpty tag is a fragment and it's not rendered in the DOM
    <>
        {/* style tag except an object */}
        {/* <h1 style={ { color: 'coral', backgroundColor: 'floralwhite' } }>Hello { toto }</h1> */}
        {/* class is reserved keyword in js, so we have to use className instead */}
        {/* <p className="cute-paragraph">Lorem ipsum dolor, sit amet consectetur adipisicing elit. A, corporis sapiente ducimus modi nulla vitae ipsa libero distinctio dolore molestiae.</p> */}


        {/* <input type="checkbox" id="the-checkbox" /> */}
        {/* Same here with for, it is a reserved keyword in js, so we have to use htmlFor instead */}
        {/* {<label htmlFor="the-checkbox">The checkbox</label>} */}

        <App clickersCount={ 3 }>
            <h1>This is text sended in the children props</h1>
        </App>
    </>
)
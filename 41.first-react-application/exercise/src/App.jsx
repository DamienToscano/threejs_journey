import { useState } from 'react'
import Clicker from './Clicker.jsx'

// Children props is a special props that contains all the things between the opening and closing tag of the component
export default function App({ clickersCount, children }) {
    const [hasClicker, setHasClicker] = useState(true)
    const [count, setCount] = useState(0)

    const toggleClicker = () => {
        setHasClicker(prevHasClicker => !prevHasClicker)
    }

    const increment = () => {
        setCount(count + 1)
    }

    return <>
        {children}

        <div>Total count : {count}</div>

        <button onClick={toggleClicker}>{hasClicker ? 'Hide' : 'Show'} Clicker</button>
        {/* Use a ternary condition to make the component show or disappear */}
        {/* { hasClicker ? <Clicker /> : null} */}
        {/* Or use && to display the component only if hasClicker is true */}
        {/* We try to have multiple clicker conditionnally */}
        {hasClicker && <>
            {/* We can pass a function in a child, to use it into it */ }
            {/* We loop on clickersCount number to create 4 clickers */}
            {[...Array(clickersCount)].map((value, index) => 
                <Clicker
                    key={ index }
                    increment={increment}
                    keyName={ `clicker-${index}` }
                    textColor={`hsl(${Math.random() * 360}deg, 100%, 70%)`}
                />
            )}
        </>}
    </>

}
import { useEffect, useState, useRef } from "react"

/* Props are sended in the function argument props */
/* We can destructuring the props object to get exactly the value we need */
export default function Clicker({ increment, keyName, textColor = 'green' })
{
    // To create a reactive variable, we use the useState hook. So when the variable is updated, the component is re-rendered
    // We separate the variable and the setter to be more convenient
    const [ count, setCount ] = useState(parseInt(localStorage.getItem(keyName) ?? 0))

    // useRef is a hook that allows us to create a reference to a DOM element or some Three.js object
    const button = useRef()

    // useEffect is a hook that allows us to execute code when the component is mounted, updated or unmounted
    // In second parameter, we can pass an array of variables. If one of these variables is updated, the effect is executed
    // So, if we pass an empty array, the effect is executed only when the component is mounted
    useEffect(() =>
    {
        button.current.style.backgroundColor = 'papayaWhip'
        button.current.style.color = 'salmon'

        // We can return a function that is executed when the component is unmounted
        return () =>
        {
            localStorage.removeItem(keyName)
        }
    }, [])

    useEffect(() =>
    {
        localStorage.setItem(keyName, count)
    }, [ count ])

    const buttonClick = () =>
    {
        // We update the variable with the setter
        // setCount(count + 1)
        // If we want to update the variable based on its previous value, we have to use a callback function. It is better because the variable is updated asynchronously
        setCount(prevCount => prevCount + 1)

        /* Increment is a function of the parent */
        increment()
    }

    return <div>
        <div style={ { color: textColor } }>Clicks count : { count }</div>
        <button ref={ button } onClick={ buttonClick }>Click me</button>
    </div>
}
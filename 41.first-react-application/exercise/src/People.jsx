import { useEffect, useState } from "react"

export default function People()
{
    const [people, setPeople] = useState([])

    const getPeople = async () =>
    {
        // We fetch the fake API to get the people, which is a promise
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const result = await response.json()

        // We update the people variable with the setter when the promise is resolved
        setPeople(result)
    }

    useEffect(() =>
    {
        getPeople()
    }, [])

    return <div>
        <h2>People</h2>
        { people.length === 0 && <div>Loading...</div>  }
        <ul>
            { people.map((person) => 
                <li key={ person.id }>{ person.name }</li>
            ) }
        </ul>
    </div>
}
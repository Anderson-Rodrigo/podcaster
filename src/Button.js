import {useState} from 'react'

export default function Button(props){
    const [counter, setCounter] = useState(1)
    
    function increment(){
        setCounter(counter +1)
    }


    return (
        <>
        <span>{counter}</span>
        <button onClick={increment} title={props.title}>Click me</button>
        <br/>
        </>
    )
}
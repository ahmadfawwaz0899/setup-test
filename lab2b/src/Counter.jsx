import { useState } from 'react'
// Step 1: state. useState returns the current value and a function to change it.
function Counter() {
 const [count, setCount] = useState(0)
 return (
 <div className="box">
 <p>You clicked {count} times</p>
 <button onClick={() => setCount(count + 1)}>+1</button>
 <button onClick={() => setCount(0)}>Reset</button>
 </div>
 )
}
export default Counter
import { useState } from 'react'
// Step 2: props + state together. `label` comes from the parent; `liked` is this button's own state.
function LikeButton({ label }) {
 const [liked, setLiked] = useState(false)
 return (
 <button className={liked ? 'liked' : ''} onClick={() => setLiked(!liked)}>
 {liked ? '♥' : '♡'} {label}
 </button>
 )
}
export default LikeButton
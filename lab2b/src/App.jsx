import Counter from './Counter.jsx'
import LikeButton from './LikeButton.jsx'
import SubjectList from './SubjectList.jsx'
import './App.css'

// Sample subjects array for SubjectList (as per Lab 2 Part A4)
const subjects = [
  { code: 'BICS 3301', name: 'Cross-Platform Software Development' },
  { code: 'INFO 2302', name: 'Web Application Development' },
  { code: 'INFO 1101', name: 'Database Systems' },
]

function App() {
  return (
    <main className="app-container">
      <h1>Lab 2: Props, Lists and State</h1>

      {/* Counter Component */}
      <section>
        <Counter />
      </section>

      {/* Standalone LikeButton Component */}
      <section>
        <LikeButton label="Like" />
      </section>

      {/* SubjectList Component rendering list with LikeButton */}
      <section>
        <SubjectList subjects={subjects} />
      </section>
    </main>
  )
}

export default App
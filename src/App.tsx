import ConsolidationDashboard from './components/ConsolidationDashboard'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <ConsolidationDashboard />
    </ThemeProvider>
  )
}

export default App

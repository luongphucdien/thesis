import { BrowserRouter } from "react-router-dom"
import { CustomRoute } from "./routes"

function App() {
    return (
        <BrowserRouter>
            <div className="app-wrapper">
                <CustomRoute />
            </div>
        </BrowserRouter>
    )
}

export default App

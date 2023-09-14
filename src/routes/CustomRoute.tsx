import { Route, Routes } from "react-router-dom"
import { ARScene } from "../core/ARScene"
import { Home } from "../pages/home"
import { Page } from "./Page"

export const CustomRoute = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Page title="Home">
                        <Home />
                    </Page>
                }
            />

            <Route
                path="/ar"
                element={
                    <Page title="AR Mode">
                        <ARScene />
                    </Page>
                }
            />
        </Routes>
    )
}

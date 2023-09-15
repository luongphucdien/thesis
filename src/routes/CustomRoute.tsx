import { Route, Routes } from "react-router-dom"
import { ARScene } from "../core/ARScene"
import { Dashboard } from "../pages/dashboard"
import { Home } from "../pages/home"
import { Page } from "./Page"
import { PageWithBG } from "./PageWithBG"

export const CustomRoute = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Page title="Home">
                        <PageWithBG>
                            <Home />
                        </PageWithBG>
                    </Page>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <Page title="Dashboard">
                        <PageWithBG>
                            <Dashboard />
                        </PageWithBG>
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

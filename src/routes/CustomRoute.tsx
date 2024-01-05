import { Route, Routes } from "react-router-dom"
import { ARScene } from "../core/ARScene"
import { Editor } from "../core/editor"
import { Dashboard } from "../pages/dashboard"
import { SignIn } from "../pages/sign-in"
import { SignUp } from "../pages/sign-up"
import { Page } from "./Page"
import { PrivatePage } from "./PrivatePage"
import { PublicPage } from "./PublicPage"

export const CustomRoute = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicPage>
                        <Page title="Sign In">
                            <SignIn />
                        </Page>
                    </PublicPage>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <PrivatePage>
                        <Page title="Dashboard">
                            <Dashboard />
                        </Page>
                    </PrivatePage>
                }
            />

            <Route
                path="/project/new"
                element={
                    <PrivatePage>
                        <Page title="New Floor Plan">
                            <Editor />
                        </Page>
                    </PrivatePage>
                }
            />

            <Route
                path="/project/:name"
                element={
                    <PrivatePage>
                        <Editor />
                    </PrivatePage>
                }
            />

            <Route
                path="/ar"
                element={
                    <PrivatePage>
                        <Page title="AR Mode">
                            <ARScene />
                        </Page>
                    </PrivatePage>
                }
            />

            <Route
                path="/sign-up"
                element={
                    <PublicPage>
                        <Page title="Sign Up">
                            <SignUp />
                        </Page>
                    </PublicPage>
                }
            />

            <Route
                path="/sign-in"
                element={
                    <PublicPage>
                        <Page title="Sign In">
                            <SignIn />
                        </Page>
                    </PublicPage>
                }
            />
        </Routes>
    )
}

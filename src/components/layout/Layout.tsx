import React from "react"

interface SidebarLayoutProps {
    children: [React.ReactElement, React.ReactElement] | React.ReactElement
    sidebarSize?: "compact" | "default"
}
export const SidebarLayout = ({
    children,
    sidebarSize = "default",
}: SidebarLayoutProps) => {
    return (
        <div className="flex h-full">
            {React.Children.map(children, (child, i) => (
                <div
                    key={`child-${i}`}
                    className={
                        i === 0
                            ? sidebarSize === "compact"
                                ? "sidebar-layout-compact"
                                : "sidebar-layout-default"
                            : "sidebar-layout-main"
                    }
                >
                    {child}
                </div>
            ))}
        </div>
    )
}

import { useState } from "react"
import { Text, View } from "react-native"

export default function Page() {
    const [state, setState] = useState(false)
    const test = () => {
        setState(!state)
    }

    return (
        <View className="flex flex-col">
            <View className="p-10 bg-slate-400">
                <Text>Hello World</Text>
                <Text>This is the first page of your app.</Text>
            </View>

            <View
                className={`${state ? "bg-slate-400" : "bg-red-400"} p-10`}
                onTouchStart={test}
            >
                <Text>Another View</Text>
            </View>
        </View>
    )
}

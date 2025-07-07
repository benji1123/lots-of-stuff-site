import { useState, useEffect } from "react"

export default function StatusBar() {
    const moonPhaseMap: Record<string, string> = {
        'new moon': '🌑',
        'waxing crescent': '🌒',
        'first quarter': '🌓',
        'waxing gibbous': '🌔',
        'full moon': '🌕',
        'waning gibbous': '🌖',
        'last quarter': '🌗',
        'waning crescent': '🌘'

    }
    const [moon, setMoon] = useState('')

    const unixTimeNow = Date.now();

    useEffect(() => {
        fetch(`https://api.farmsense.net/v1/moonphases/?d=${unixTimeNow}`)
            .then(res => res.json())
            .then(res => res[0].Phase.toLowerCase())
            .then(setMoon)
            .then(res => console.log(`moon phase: ${res}`))
    }, [])

    return (
        <div className="flex px-[1.5em] h-[50px] w-viewport bg-black/10 rounded-sm items-center text-md text-gray-500">
            {moon}: {moonPhaseMap[moon]}
        </div>
    )
}
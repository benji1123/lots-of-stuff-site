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
    const [moon, setMoon] = useState<any>({ Phase: '' })
    const[dayData, setDayData] = useState({ sunset: '', sunrise: '', dusk: '' })

    const unixTime = Math.floor(Date.now() / 1000); // UTC seconds
    console.log(`time: ${unixTime}`)

    // fetch moon phase - https://www.farmsense.net/api/astro-widgets/
    useEffect(() => {
        fetch(`https://api.farmsense.net/v1/moonphases/?d=${unixTime}`)
            .then(res => res.json())
            .then(res => res[0])
            .then(setMoon)
            .then(res => console.log(`moon: ${res}`))
    }, [])

    // fetch sunset and sunrise - https://sunrisesunset.io/api/
    const vancouverCoord = {
        latitude: 49.246292,
        longitude: -123.116226
    }
    useEffect(() => {
        fetch(`https://api.sunrisesunset.io/json?lat=${vancouverCoord.latitude}&lng=${vancouverCoord.longitude}`)
            .then(res => res.json())
            .then(res => {
                console.log(JSON.stringify(res))
                const data = res.results
                setDayData(data);
            })
            .then(res => console.log(`day data: ${res}`))
    }, [])

    return (
        <div className="flex gap-[2em] px-[1.5em] h-[50px] w-viewport bg-black/10 rounded-sm items-center text-md text-gray-500">
            <div>
                {moonPhaseMap[moon.Phase.toLowerCase()]} {moon.Phase.toLowerCase()}
            </div>

            <div>
                🌅 {dayData.sunrise}
            </div>

            <div>
                🌇 {dayData.sunset}
            </div>

            <div>
                🌆 {dayData.dusk}
            </div>
        </div>
        
    )
}

import { useState, useEffect, ReactNode } from "react"
import { OpenMeteoCurrentWeather } from "../data/types"

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
    const [weather, setWeather] = useState<OpenMeteoCurrentWeather | any>({})

    const unixTime = Math.floor(Date.now() / 1000); // UTC seconds
    console.log(`time: ${unixTime}`)

    // fetch moon phase - https://www.farmsense.net/api/astro-widgets/ (public)
    useEffect(() => {
        fetch(`https://api.farmsense.net/v1/moonphases/?d=${unixTime}`)
            .then(res => res.json())
            .then(res => res[0])
            .then(setMoon)
            .then(res => console.log(`moon: ${res}`))
    }, [])

    // fetch sunset and sunrise - https://sunrisesunset.io/api/ (public)
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
    }, [])

    // Fetch weather = https://open-meteo.com/en/docs?latitude=49.246292&longitude=-123.116226&timezone=auto&hourly=&forecast_days=1&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m#settings (public)
    useEffect(() => {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=49.246292&longitude=-123.116226&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`)
        .then(res => res.json())
        .then(setWeather)
    }, [])

    return (
        <div className="flex gap-[1em] px-[1.5em] h-[50px] w-viewport rounded-sm items-center text-md text-gray-400">
            {/* moon-phase and sunset/sunrise/dusk */}
            <StatusBarContainer>
                <div>{moonPhaseMap[moon.Phase.toLowerCase()]} {moon.Phase.toLowerCase()}</div>
            </StatusBarContainer>

            <StatusBarContainer>
                <div>🌅 {dayData.sunrise}</div>
                <div>🌇 {dayData.sunset}</div>
                <div>🌆 {dayData.dusk}</div>
            </StatusBarContainer>
            
            {/* weather */}
            <StatusBarContainer>
                🗜 {weather?.current?.pressure_msl}{weather?.current_units?.pressure_msl}
            </StatusBarContainer>

            <StatusBarContainer>
                <div>
                {weather?.current?.temperature_2m}{weather?.current_units?.temperature_2m}
                </div>
                <div>
                    💦 {weather?.current?.rain}{weather?.current_units?.rain}
                </div>
                <div>
                    🌪️ {weather?.current?.wind_speed_10m}{weather?.current_units?.wind_speed_10m} {degToCardinal(weather?.current?.wind_direction_10m)}
                </div>
            </StatusBarContainer>
        </div>
        
    )
}

const degToCardinal = (degrees: number): string => {
  const cardinalDirections = [
    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW"
  ];
  const degPerDirection = 360 / cardinalDirections.length;
  const index = Math.round(degrees / degPerDirection);
  return cardinalDirections[Math.min(index, cardinalDirections.length-1)];
}


type StatusBarContainerProps = {
  color?: string;
  children: ReactNode;
};

function StatusBarContainer({ color = "bg-black/85", children }: StatusBarContainerProps) {
  return (
    <div className={`flex gap-[1em] text-xs md:text-sm whitespace-nowrap px-[1.5em] py-2 rounded-full text-gray-400 ${color}`}>
      {children}
    </div>
  );
}
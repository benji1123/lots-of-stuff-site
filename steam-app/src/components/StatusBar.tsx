import { useState, useEffect, ReactNode } from "react"
import { OpenMeteoCurrentWeather } from "../data/types"

const MUSIC_TOGGLE_ID = "music-toggle-btn";
const MOON_PHASE_MAP: Record<string, string> = {
    'new moon': '🌑',
    'waxing crescent': '🌒',
    'first quarter': '🌓',
    'waxing gibbous': '🌔',
    'full moon': '🌕',
    'waning gibbous': '🌖',
    'last quarter': '🌗',
    'waning crescent': '🌘'

}

let RAIN_PATH = "./../public/rain.mp3";
let STELLAR_BLADE_PATH = "https://api.ben-feed.cc/static/audio/stellarblade.mp3";
let AUDIO = new Audio(STELLAR_BLADE_PATH);
AUDIO.volume = 0.1;

const toggleAudio = () => {
    const element = document.getElementById(MUSIC_TOGGLE_ID);
    if (AUDIO.paused) {
        AUDIO.play()
        if (element) element.textContent = '⏸️';
    } else {
        AUDIO.pause();
        if (element) element.textContent = '▶️';
    }
}

export default function StatusBar() {
    const [audioMetadata, setAudioMetadata] = useState({ title: "", artist: "", album: "" });
    useEffect(() => {
        fetch(`/api/audio-metadata/stellarblade.mp3`)
            .then(res => res.json())
            .then(setAudioMetadata)
    }, []);

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
                <div>{MOON_PHASE_MAP[moon.Phase.toLowerCase()]} {moon.Phase.toLowerCase()}</div>
            </StatusBarContainer>

            <StatusBarContainer>
                <div>🌅 {stripSeconds(dayData.sunrise)}</div>
                <div>🌇 {stripSeconds(dayData.sunset)}</div>
                <div>🌆 {stripSeconds(dayData.dusk)}</div>
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

            <StatusBarContainer>
                <button id={MUSIC_TOGGLE_ID} onClick={toggleAudio}>▶️</button>
                <span>
                    {audioMetadata.title} {audioMetadata.artist && `- ${audioMetadata.artist}`}
                </span>
            </StatusBarContainer>
        </div>
        
    )
}

type StatusBarContainerProps = {
  color?: string;
  children: ReactNode;
};

function StatusBarContainer({ color = "bg-black/75", children }: StatusBarContainerProps) {
  return (
    <div className={`flex gap-[1em] text-xs md:text-sm whitespace-nowrap px-[1.5em] py-2 rounded-full text-gray-400 ${color}`}>
      {children}
    </div>
  );
}

// Utility function to remove seconds from a time string like "5:17:02 AM"
function stripSeconds(time: string) {
  // Handles both 12h and 24h formats
  // e.g. "5:17:02 AM" -> "5:17 AM", "17:17:02" -> "17:17"
  return time.replace(/(\d{1,2}:\d{2}):\d{2}(\s*[AP]M)?/, "$1$2");
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

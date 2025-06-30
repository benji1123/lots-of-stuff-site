import { useEffect, useState } from "react";
import { CHESS_COM_API_HEADERS } from "../constants";

type Props = {
    username: string;
}

type ChessProfile = any | {
    avatar: string;
    url: string;
    name: string;
    username: string;
    title: string;
    followers: string;
    country: any;
    location: string;
    last_online: string;
    joined: string;
    status: string;
    league: string;
}

/** example response
 * {
  "avatar": "https://images.chesscomfiles.com/uploads/v1/user/15448422.88c010c1.200x200o.3c5619f5441e.png",
  "player_id": 15448422,
  "@id": "https://api.chess.com/pub/player/hikaru",
  "url": "https://www.chess.com/member/Hikaru",
  "name": "Hikaru Nakamura",
  "username": "hikaru",
  "title": "GM",
  "followers": 1271638,
  "country": "https://api.chess.com/pub/country/US",
  "location": "Florida",
  "last_online": 1751208117,
  "joined": 1389043258,
  "status": "premium",
  "league": "Legend",
} */
export default function ChessProfile({ username }: Props) {
    const [profile, setProfile] = useState<ChessProfile>({});
    useEffect(() => {
        async function fetchProfile() {
            const playerData = await fetch(
              `https://api.chess.com/pub/player/${username}`,
              { headers: CHESS_COM_API_HEADERS }
            );
            setProfile(await playerData.json());
        }
        fetchProfile()
    }, []) // the '[]' means this hook only runs when ChessProfile is mounted (as we don't need to update player data)

    if (!profile || !profile.username) {
        return <div className="text-gray-400">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col text-xs font-mono p-2 text-white text-xs">
            {profile.avatar && (
                <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="rounded-lg w-10 h-10 border border-gray-700"
                />
            )}
            <span className="bg-[#779952] text-[#141414] font-bold px-2 py-0.5 rounded my-2">{profile.username}</span>
            <div>🌱 {convertEpochToDate(profile.joined)}</div>
            <div>🟢 {convertEpochToDate(profile.last_online)}</div>
        </div>
    );
}

const convertEpochToDate = (epoch: number) => {
    const date = new Date(epoch * 1000);
    return date.toISOString();
}

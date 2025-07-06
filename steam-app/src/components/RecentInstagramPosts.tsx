import { useEffect, useState } from "react";

type InstagramPost = {
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    timestamp: string;
    permalink: string;
}

const POST_LIMIT = 8;

export default function RecentInstagramPosts() {
    const [posts, setPosts] = useState<InstagramPost[]>([])

    useEffect(() => {
        fetch(`/api/instagram/posts?limit=${POST_LIMIT}`)
            .then(res => res.json())
            .then(setPosts)
            .catch(err => console.log('failed to fetch IG posts: ', err))
    }, []);

    return (
        // small screens: 1-col
        // medium screens: 4-cols
        // large screens: 8-cols
        <div className={`ig-posts grid grid-cols-2 md:grid-cols-4 lg:grid-cols-${POST_LIMIT}  gap-[1em] items-end text-white font-mono`}>
            {posts.map((post, i) => (
                <div key={i} className='text-xs max-w-[150px]'>
                    <a href={post.permalink} target="_blank">
                        <img src={post.media_url} width={150} className='rounded-lg mb-1 shadow-sm shadow-black/30'></img>
                        <div>{post.timestamp.slice(0,16)}</div>
                        <div className="truncate mr-5">{getCaption(post)}</div>
                    </a>
                </div>
            ))}
        </div>
    );
}

const CAPTION_CHAR_LIMIT = 30;
const DEFAULT_CAPTION = 'no cap'
const getCaption = (post: InstagramPost) => post.caption ? post.caption.slice(0, CAPTION_CHAR_LIMIT) : DEFAULT_CAPTION
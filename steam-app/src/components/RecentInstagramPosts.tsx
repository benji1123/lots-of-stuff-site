import { useEffect, useState } from "react";

type Props = {
  accountAlias: string;
  postLimit: number;
};

type InstagramPost = {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  timestamp: string;
  permalink: string;
};

/**
 *
 * @param accountAlias - corresponds to the alias/keyname used in the server to 
 * store the account's Instagram API token
 * @param limit - the number of instagram posts to fetch and render
 * @returns
 */
export default function RecentInstagramPosts({
  accountAlias,
  postLimit,
}: Props) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetch(`/api/instagram/posts?account=${accountAlias}&limit=${postLimit}`)
      .then((res) => {
        console.log(`IG fetch for alias ${accountAlias}: ${JSON.stringify(res.json)}`)
        return res.json();
      })
      .then((res) => res.slice(0, postLimit))
      .then(setPosts)
      .catch((err) => console.log("failed to fetch IG posts: ", err));
  }, []);

  return (
    // small screens: 1-col
    // medium screens: 4-cols
    // large screens: 8-cols
    <div
      className={`ig-posts grid grid-cols-2  gap-3 items-end font-mono`}
    >
      {posts.map((post, i) => (
        <div key={i} className="text-xs max-w-[150px]">
          <a href={post.permalink} target="_blank">
            { (post.media_type == 'VIDEO') 
                ? <video loop controls muted autoPlay width="320" className="rounded-lg w-full mb-1">
                        <source src={post.media_url} type="video/mp4"/>
                        Your browser does not support the video tag.
                  </video>
                : <img
                    src={post.media_url}
                    width={150}
                    className="rounded-lg mb-1"/>
            }
            <div>{post.timestamp.slice(0, 16)}</div>
            <div className="truncate mr-5">{getCaption(post)}</div>
          </a>
        </div>
      ))}
    </div>
  );
}

const CAPTION_CHAR_LIMIT = 30;
const DEFAULT_CAPTION = "no cap";
const getCaption = (post: InstagramPost) =>
  post.caption ? post.caption.slice(0, CAPTION_CHAR_LIMIT) : DEFAULT_CAPTION;

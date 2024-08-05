import { getPost } from "@/api/post";
import UserAvatar from "@/components/UserAvatar";
import Video from "@/components/Video";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  let post = await getPost(id);
  let title = `Oog / ${post.title}`
  return {
    title: title,
    description: post.body,
    openGraph: {
      images: [process.env.NEXT_PUBLIC_OG_URL + "/api/og/post/" + id],
    },
  }
}


export default async function PostDetail({ params }: { params: { id: string } }) {

  let post = await getPost(params.id);
  let video = post.videos?.[0];

  return (
    <div className="relative h-full">

      <div className="h-full bg-red-600">
        {video?.hlsURL && <Video url={video?.hlsURL} />}
      </div>

      {<div className="flex absolute bottom-0 right-0 left-0 bg-black/50 text-white flex-col space-y-3 z-10 p-5">

        <div className="text-white text-sm flex items-center gap-x-2">
          <UserAvatar user={post.author} size="lg" />
          <div className="space-y-1">
            <div className="font-bold">{post.author?.firstName} {post.author?.lastName} <span className="bg-white text-black rounded-md p-1 text-xs">{post.author?.credential}</span></div>
            <div className="font-thin text-sm">{post.author?.npiTaxonomyDescription}</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="truncate flex-1">{post.title}</div><div>Show More</div>
        </div>
      </div>}
    </div>
  )
}

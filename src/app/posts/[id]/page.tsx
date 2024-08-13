import { getPost } from "@/api/post";
import Logo from "@/components/Logo";
import UserAvatar from "@/components/UserAvatar";
import { formatDistance, parseISO } from "date-fns";
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
  let title = `${post.title}`
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

  return (
    <div className="relative h-full">

      {<div className="flex absolute top-0 right-0 left-0 bg-black/50 text-white flex-col p-5">

        <div className="flex justify-around mb-8">
          <div></div>
          <div>
            <Logo />
          </div>
          <div></div>
        </div>

        <div className="space-y-4">
          <div className="text-white text-sm flex gap-x-2">
            <UserAvatar user={post.author} size="lg" />
            <div className="gap-x-4 flex flex-col">
              <div className="font-bold">{post.author?.firstName} {post.author?.lastName} <span className="bg-white ml-2 text-black rounded-md p-0.5 text-xs">{post.author?.credential}</span></div>
              <div className="font-thin text-sm">{post.author?.npiTaxonomyDescription}</div>
            </div>
            {post.createdAt && <div className="ml-auto text-gray-500">
              {formatDistance(parseISO(post.createdAt), new Date())}
            </div>}
          </div>

          <div className="h-full flex gap-x-2">
            <div className="bg-stiches bg-center bg-repeat-y w-12">&nbsp;</div>
            <div className="flex-1 space-y-4">
              <div className="line-clamp-3 text-sm">{post.body}</div>
              {post?.coverImage?.url && <img className="rounded-xl" src={post.coverImage.url + "public"} />}
            </div>
          </div>
        </div>


      </div>}
    </div>
  )
}

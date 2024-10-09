import { getPost } from '@/api/post';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    let post = await getPost(params.id);
    let video = post.videos?.[0];
    let thumbnailURL = post.coverImage?.url + "public"
    console.log(thumbnailURL)

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 40,
                    color: 'white',
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    padding: '50px 50px',
                    textAlign: 'left',
                    position: 'relative',
                }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img style={{ height: 400, objectFit: 'cover' }} src={thumbnailURL!} />
                </div>

                <div style={{ display: 'flex', position: 'absolute', right: 20, bottom: 20 }}>
                    <img style={{ width: 150 }} src="https://learn.oog.health/logo.svg" alt="oog" />
                </div>


            </div >
        ),
        {
            width: 600,
            height: 600,
        },
    );
}

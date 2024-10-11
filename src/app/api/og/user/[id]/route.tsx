import { getUser } from '@/api/user';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    let user = await getUser(params.id);

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
                <div style={{ display: 'flex', fontSize: 64, color: "#A4F421" }}>
                    {user.firstName} {user.lastName}
                </div>

                <div style={{ display: 'flex', position: 'absolute', right: 20, bottom: 20 }}>
                    <img style={{ width: 150 }} src="https://learn.oog.health/logo.svg" alt="oog" />
                </div>


            </div >
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}

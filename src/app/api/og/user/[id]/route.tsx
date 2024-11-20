import { getUser } from '@/api/user';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    let user = await getUser(params.id);
    let profileImageUrl = user.profileImage?.url;

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
                    padding: '25px 25px',
                    textAlign: 'left',
                    position: 'relative',
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, color: "white" }}>
                    <div style={{ display: 'flex' }}>{user.firstName} {user.lastName} {user.credential}</div>
                    <div style={{ display: 'flex', fontSize: 32 }}>
                        {user?.npiTaxonomyDescription}
                    </div>
                </div>

                {profileImageUrl && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            style={{ width: 350, height: 350, borderRadius: 175, marginTop: 20, objectFit: 'cover' }}
                            src={profileImageUrl + "preview"}
                            alt="profile"
                        />
                    </div>
                )}

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

import { getUser } from "@/api/user";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { id: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id
    let user = await getUser(id);
    let title = `Oog / ${user.firstName} ${user.lastName}`
    return {
        title: title,
        openGraph: {
            images: [process.env.NEXT_PUBLIC_OG_URL + "/api/og/user/" + id],
        },
    }
}

export default async function UserDetail({ params }: { params: { id: string } }) {

    let user = await getUser(params.id);

    return (
        <div>
            <h1>User {user.firstName} {user.lastName}</h1>
        </div>
    )
}

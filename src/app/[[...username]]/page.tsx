import { getUserByUsername } from "@/api/user";
import Logo from "@/components/Logo";
import UserAvatar from "@/components/UserAvatar";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { username: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    let un = params.username[0];
    let id = un;
    let user = await getUserByUsername(id);
    let title = `Oog / ${user.firstName} ${user.lastName}`
    return {
        title: title,
    }
}

export default async function Page({ params }: { params: { username: string } }) {
    let un = params.username[0];
    let user = await getUserByUsername(un);
    console.log(user);
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


                <div className="flex flex-col items-center justify-center space-y-8" >
                    <UserAvatar user={user} size="5xl" />

                    <div className="gap-x-4 flex flex-col text-center mx-8">
                        <div className="font-bold">{user?.firstName} {user?.lastName} <span className="bg-white ml-2 text-black rounded-md p-0.5 text-xs">{user.credential}</span></div>
                        <div className="font-thin text-sm">{user?.npiTaxonomyDescription}</div>
                    </div>
                </div>


            </div>}
        </div>
    )
}


import { createChat } from "@/api/chats";
import { ConversationModel } from "@/gql/graphql";
import { redirect } from "next/navigation";

export default async function Chat() {

    let chatToken = await createChat(ConversationModel.OpenEvidence, null)
    redirect(`/chat/v2/${chatToken}`)

}

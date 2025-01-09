
import { createChat } from "@/api/chats";
import { ConversationModel } from "@/gql/graphql";
import { redirect } from "next/navigation";

export default async function Chat() {
    console.log("create new chat")
    let chatToken = await createChat(ConversationModel.OpenEvidence, null)
    redirect(`/chat/v2/${chatToken}`)

}

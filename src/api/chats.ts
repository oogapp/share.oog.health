'use server'
import { graphql } from "@/gql";
import { AdminCreateConversationFromConversationMutation, AdminCreateConversationFromPostMutation, AdminCreateConversationMutation, CurrentUserQuery, SparkyConversation, SparkyConversationsQuery, SparkyConversationWhereInput, SparkyMessage, SparkyMessageQuery, SparkyMessagesQuery, SparkyMessageWhereInput, User } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";
import { cache } from "react";

const CurrentUser = graphql(`
  query CurrentUser {
  currentUser {
    id
    streamToken
    firstName
    lastName
  }
}
`)

const GetMessage = graphql(`
  query SparkyMessage($id: ID!) {
  node(id: $id) {
    ... on SparkyMessage {
      conversation {
        id
      }
      notHelpful
      references {
        citationKey
        sourceTexts
        referenceText
        referenceDetail {
          doi
          url
          title
          journalName
          authorsString
          publicationDate
          publicationInfoString
        }
      }
    }
  }
}
`)

const GetMessages = graphql(`
query SparkyMessages($where: SparkyMessageWhereInput!) {
  sparkyMessages(where: $where) {
    edges {
      node {
        id
        body
        notHelpful
        conversation {
          id
        }
        references {
          citationKey
          sourceTexts
          referenceText
          referenceDetail {
            doi
            url
            title
            journalName
            authorsString
            publicationDate
            publicationInfoString
          }
        }
      }
    }
  }
}
`)

const GetConversation = graphql(`
query SparkyConversation($id: ID!) {
  node(id: $id) {
    ... on SparkyConversation {
      id
      token
      model
      createdAt
      messages {
        body
        notHelpful
      }
      targetConversation {
        id
        token
      }
    }
  }
}
`)

const GetConversations = graphql(`
query SparkyConversations($where: SparkyConversationWhereInput!) {
  sparkyConversations(where: $where) {
    edges {
      node {
        id
        token
        model
        createdAt
      	messages {
          body
          notHelpful
        }
      }
  	}
  }
}
`)

const CreateConversation = graphql(`
mutation AdminCreateConversationFromPost($postId: ID!, $configId: ID) {
  adminCreateConversationFromPost(postId: $postId, configID: $configId) {
    id
    token
  }
}
`)

const AdminCreateConversationFromConversation = graphql(`
mutation AdminCreateConversationFromConversation($conversationId: ID!) {
  adminCreateConversationFromConversation(conversationId: $conversationId) {
    id
    token
  }
}
`)

const AdminCreateConversation = graphql(`
  mutation AdminCreateConversation($model: ConversationModel!, $userID: ID!) {
  adminCreateConversation(model: $model, userID: $userID) {
    token
  }
}
`)

const ReflectOnConversation = graphql(`
  mutation ReflectOnConversation($conversationId: ID!) {
  reflectOnConversation(conversationId: $conversationId) {
    id
  }
}
`)

const FlagMessageAsNotHelpful = graphql(`
  mutation FlagMessageNotHelpful($messageId: ID!) {
  flagMessageNotHelpful(messageId: $messageId)
}
`)


function getClient() {
  let bearerToken = cookies().get('token')?.value
  if(!bearerToken) {
    console.log("No token found in cookies, using default token")
    bearerToken = "K16tnqpqTtUTEjoqaKWwNLmMTd4Gy6jR"
  }
  return new GraphQLClient(process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT!,{
    fetch,
    headers: {
        authorization: "Bearer " + bearerToken
    }
  })
}

async function createChat(postId: string): Promise<String> {
    let resp: AdminCreateConversationFromPostMutation = await getClient().request(CreateConversation.toString(), {
        postId: postId,
        configId: "1"
    });
    return resp.adminCreateConversationFromPost.token!
}

async function adminCreateChat(model: string): Promise<String> {
    let resp: AdminCreateConversationMutation = await getClient().request(AdminCreateConversation.toString(), {
        model: model,
        userID: "8589934649"
    });
    return resp.adminCreateConversation.token!
}

async function adminCreateChatFromConversation(conversationId: string): Promise<String> {
    let resp: AdminCreateConversationFromConversationMutation = await getClient().request(AdminCreateConversationFromConversation.toString(), {
        conversationId: conversationId
    });
    return resp.adminCreateConversationFromConversation.token!
}

async function getMessage(id: string): Promise<SparkyMessage> {
    let resp:SparkyMessageQuery = await getClient().request(GetMessage.toString(), {
        id: id
    });
    return resp.node as SparkyMessage;
}

async function getChats(postId?:string): Promise<SparkyConversation[]> {
  const _cookies = cookies()
  let where = {
    "hasUserWith": [{"id": "8589934649"}]
  } as SparkyConversationWhereInput
  let variables = {}

  if(postId != null && postId != ""){
    where.hasPostWith= [{"id": postId}]
  }

  let resp: SparkyConversationsQuery = await getClient().request(GetConversations.toString(), {
    where: where,
  });
  return resp.sparkyConversations.edges?.map(edge=>edge?.node) as SparkyConversation[];
}

async function getChatByToken(token: string): Promise<SparkyConversation> {
  let where = {
    token: token
  } as SparkyConversationWhereInput

  let resp: SparkyConversationsQuery = await getClient().request(GetConversations.toString(), {
    where: where,
  });
  return resp.sparkyConversations.edges?.map(edge=>edge?.node)[0] as SparkyConversation;
}

async function getMessageByStreamID(streamID: string): Promise<SparkyMessage> {
  let where = {
    streamMessageID: streamID
  } as SparkyMessageWhereInput

  let resp: SparkyMessagesQuery = await getClient().request(GetMessages.toString(), {
    where: where,
  });
  return resp.sparkyMessages.edges?.map(edge=>edge?.node)[0] as SparkyMessage;
}

async function reflectOnConversation(conversationId: string): Promise<void> {
    await getClient().request(ReflectOnConversation.toString(), {
        conversationId: conversationId
    });
}

async function flagMessageAsNotHelpful(messageId: string): Promise<void> {
    await getClient().request(FlagMessageAsNotHelpful.toString(), {
        messageId: messageId
    });
}

async function currentUser():Promise<User> {
  let resp:CurrentUserQuery = await getClient().request(CurrentUser.toString())
  return resp?.currentUser as User
}

const getChatsCached = cache(getChats);
export {
  adminCreateChat,
  adminCreateChatFromConversation,
  createChat, currentUser, flagMessageAsNotHelpful, getChatByToken,
  getChats,
  getMessage,
  getMessageByStreamID,
  reflectOnConversation
};


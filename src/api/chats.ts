'use server'
import { graphql } from "@/gql";
import { AdminCreateConversationFromConversationMutation, AdminCreateConversationFromPostMutation, AdminCreateConversationMutation, SparkyConversation, SparkyConversationsQuery, SparkyConversationWhereInput, SparkyMessage, SparkyMessageQuery, SparkyMessagesQuery, SparkyMessageWhereInput } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";
import { cache } from "react";

const GetMessage = graphql(`
  query SparkyMessage($id: ID!) {
  node(id: $id) {
    ... on SparkyMessage {
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
`)

const GetMessages = graphql(`
query SparkyMessages($where: SparkyMessageWhereInput!) {
  sparkyMessages(where: $where) {
    edges {
      node {
        id
        body
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

const client = new GraphQLClient(process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT!,{
    fetch,
    headers: {
        authorization: "Bearer K16tnqpqTtUTEjoqaKWwNLmMTd4Gy6jR"
    }
})

async function createChat(postId: string): Promise<String> {
    let resp: AdminCreateConversationFromPostMutation = await client.request(CreateConversation.toString(), {
        postId: postId,
        configId: "1"
    });
    return resp.adminCreateConversationFromPost.token!
}

async function adminCreateChat(model: string): Promise<String> {
    let resp: AdminCreateConversationMutation = await client.request(AdminCreateConversation.toString(), {
        model: model,
        userID: "8589934649"
    });
    return resp.adminCreateConversation.token!
}

async function adminCreateChatFromConversation(conversationId: string): Promise<String> {
    let resp: AdminCreateConversationFromConversationMutation = await client.request(AdminCreateConversationFromConversation.toString(), {
        conversationId: conversationId
    });
    return resp.adminCreateConversationFromConversation.token!
}

async function getMessage(id: string): Promise<SparkyMessage> {
    let resp:SparkyMessageQuery = await client.request(GetMessage.toString(), {
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

  let resp: SparkyConversationsQuery = await client.request(GetConversations.toString(), {
    where: where,
  });
  return resp.sparkyConversations.edges?.map(edge=>edge?.node) as SparkyConversation[];
}

async function getChatByToken(token: string): Promise<SparkyConversation> {
  let where = {
    token: token
  } as SparkyConversationWhereInput

  let resp: SparkyConversationsQuery = await client.request(GetConversations.toString(), {
    where: where,
  });
  return resp.sparkyConversations.edges?.map(edge=>edge?.node)[0] as SparkyConversation;
}

async function getMessageByStreamID(streamID: string): Promise<SparkyMessage> {
  let where = {
    streamMessageID: streamID
  } as SparkyMessageWhereInput

  let resp: SparkyMessagesQuery = await client.request(GetMessages.toString(), {
    where: where,
  });
  return resp.sparkyMessages.edges?.map(edge=>edge?.node)[0] as SparkyMessage;
}

async function reflectOnConversation(conversationId: string): Promise<void> {
    await client.request(ReflectOnConversation.toString(), {
        conversationId: conversationId
    });
}

const getChatsCached = cache(getChats);
export { adminCreateChat, adminCreateChatFromConversation, createChat, getChatByToken, getChats, getMessage, getMessageByStreamID, reflectOnConversation };


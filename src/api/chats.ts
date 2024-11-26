import { graphql } from "@/gql";
import { AdminCreateConversationFromConversationMutation, AdminCreateConversationFromPostMutation, AdminCreateConversationMutation, SparkyConversation, SparkyConversationsQuery, SparkyConversationWhereInput } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cache } from "react";

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


async function getChats(postId?:string): Promise<SparkyConversation[]> {

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

const getChatsCached = cache(getChats);
export { adminCreateChat, adminCreateChatFromConversation, createChat, getChatByToken, getChats };


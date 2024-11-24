import { graphql } from "@/gql";
import { AdminCreateConversationFromPostMutation, SparkyConversation, SparkyConversationsQuery } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cache } from "react";

const GetConversations = graphql(`
query SparkyConversations($where: SparkyConversationWhereInput!) {
  sparkyConversations(where: $where) {
    edges {
      node {
        id
        token
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


async function getChats(postId:string): Promise<SparkyConversation[]> {
  let resp: SparkyConversationsQuery = await client.request(GetConversations.toString(), {
    where: {
      "hasUserWith": [{"id": "8589934649"}],
      "hasPostWith": [{"id": postId}]
    },
  });
  return resp.sparkyConversations.edges?.map(edge=>edge?.node) as SparkyConversation[];
}

const getChatsCached = cache(getChats);
export { createChat, getChats };


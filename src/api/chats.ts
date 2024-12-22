'use server'
import { graphql } from "@/gql";
import { AdminCreateConversationFromConversationMutation, CreateConversationMutation, CurrentUserQuery, SparkyConversation, SparkyConversationsQuery, SparkyConversationWhereInput, SparkyMessage, SparkyMessageQuery, SparkyMessagesQuery, SparkyMessageWhereInput, User } from "@/gql/graphql";
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

const MedicalSearchSubscription = graphql(`
  subscription MedicalSearch {
  medicalSearchResponse(token:"test-token") {
    text
    citation {
      citationKey
      referenceText
      referenceDetail {
        title
        authorsString
        publicationInfoString
        journalName
        journalShortName
        publicationDate
        doi
        url
      }
    }
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
      opengraphReferences {
        title
        description
        url
        image
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
        notHelpful
        conversation {
          id
        }
        opengraphReferences {
          title
          description
          url
          image
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
          id
          body
          notHelpful
          sentBySparky
        }
      }
  	}
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

const CreateConversation = graphql(`
  mutation CreateConversation($model: ConversationModel!,$initialMessage:String) {
  createConversation(model: $model,initialMessage:$initialMessage) {
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

function getEnvFromCookies() {
  let env = cookies().get('environment')?.value
  if(!env) {
    console.log("No environment found in cookies, using default environment")
    env = "production"
  }
  if(env != "production" && env != "staging") {
    console.log("Invalid environment found in cookies, using default environment")
    env = "production"
  }
  return env
}


function getClient() {
  let bearerToken = cookies().get('auth-token')?.value
  let env = getEnvFromCookies()
  if(!bearerToken) {
    console.log("No token found in cookies, using default token")
    bearerToken = "aGIiI4EBoYdci37upZJWQQU-VUSY-zb7"
  }

  let endpoint = process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT
  if(env == "staging") {
    endpoint = process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT_STAGING
  }
  console.log("Using endpoint: " + endpoint)
  return new GraphQLClient(endpoint!,{
    fetch,
    headers: {
        authorization: "Bearer " + bearerToken
    }
  })
}


async function createChat(model: string,initialMessage:string): Promise<String> {
    let resp: CreateConversationMutation = await getClient().request(CreateConversation.toString(), {
        model: model,
        initialMessage:initialMessage
    });
    return resp.createConversation.token!
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
  adminCreateChatFromConversation,
  createChat, currentUser, flagMessageAsNotHelpful, getChatByToken,
  getChats, getEnvFromCookies, getMessage,
  getMessageByStreamID,
  reflectOnConversation
};


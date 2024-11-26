/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery SparkyConversation($id: ID!) {\n  node(id: $id) {\n    ... on SparkyConversation {\n      id\n      token\n      model\n      createdAt\n      messages {\n        body\n      }\n      targetConversation {\n        id\n        token\n      }\n    }\n  }\n}\n": types.SparkyConversationDocument,
    "\nquery SparkyConversations($where: SparkyConversationWhereInput!) {\n  sparkyConversations(where: $where) {\n    edges {\n      node {\n        id\n        token\n        model\n        createdAt\n      \tmessages {\n          body\n        }\n      }\n  \t}\n  }\n}\n": types.SparkyConversationsDocument,
    "\nmutation AdminCreateConversationFromPost($postId: ID!, $configId: ID) {\n  adminCreateConversationFromPost(postId: $postId, configID: $configId) {\n    id\n    token\n  }\n}\n": types.AdminCreateConversationFromPostDocument,
    "\nmutation AdminCreateConversationFromConversation($conversationId: ID!) {\n  adminCreateConversationFromConversation(conversationId: $conversationId) {\n    id\n    token\n  }\n}\n": types.AdminCreateConversationFromConversationDocument,
    "\n  mutation AdminCreateConversation($model: ConversationModel!, $userID: ID!) {\n  adminCreateConversation(model: $model, userID: $userID) {\n    token\n  }\n}\n": types.AdminCreateConversationDocument,
    "\nquery Post($id: ID!) {\n  node(id: $id) {\n    ... on Post {\n      id\n  type\n  title\n  createdAt\n  status\n  body\n  featured\n  insightsGeneratedAt\n  commentsDisabled\n  creditHours\n  topics {\n    id\n    name\n  }\n  topicClassifications {\n    id\n    modelVersion\n    topic {\n      id\n      name\n    }\n    active\n    suggested\n  }\n  audiences {\n    id\n    name\n  }\n  totalComments\n  totalLikes\n  totalBookmarks\n  termsPerMinute\n  author {\n    id\n    username\n    firstName\n    lastName\n    username\n    hasSubmittedDisclosure\n    hasDisclosuresNeedingReview\n    reflectionsOnAuthoredPostsDisabled\n    npiTaxonomyCode\n    npiTaxonomyDescription\n    credential\n    profileImage {\n      url\n    }\n  }\n  coverImage {\n    id\n    url\n  }\n  videos {\n    id\n    thumbnailURL\n    alternatePlaylists {\n      cdn\n      url\n    }\n    duration\n    width\n    height\n    hlsURL\n    insightsGeneratedAt\n    discussionPoints\n    terms\n    termFrequencies\n    termsPerMinute\n    wordcloud\n  }\n    }\n  }\n}\n": types.PostDocument,
    "\nquery Users($where: UserWhereInput!) {\n  users(where: $where) {\n    edges {\n      node {\n        id\n        firstName\n        lastName\n        credential\n        npiTaxonomyCode\n        npiTaxonomyDescription\n        profileImage {\n          id\n          url\n          width\n          height\n        }\n      }\n  \t}\n  }\n}\n": types.UsersDocument,
    "\nquery User($id: ID!) {\n  node(id: $id) {\n    __typename\n    ... on User {\n      id\n      firstName\n      lastName\n      credential\n      npiTaxonomyCode\n      npiTaxonomyDescription\n      profileImage {\n        id\n        url\n        width\n        height\n      }\n    }\n  }\n}\n": types.UserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery SparkyConversation($id: ID!) {\n  node(id: $id) {\n    ... on SparkyConversation {\n      id\n      token\n      model\n      createdAt\n      messages {\n        body\n      }\n      targetConversation {\n        id\n        token\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SparkyConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery SparkyConversations($where: SparkyConversationWhereInput!) {\n  sparkyConversations(where: $where) {\n    edges {\n      node {\n        id\n        token\n        model\n        createdAt\n      \tmessages {\n          body\n        }\n      }\n  \t}\n  }\n}\n"): typeof import('./graphql').SparkyConversationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation AdminCreateConversationFromPost($postId: ID!, $configId: ID) {\n  adminCreateConversationFromPost(postId: $postId, configID: $configId) {\n    id\n    token\n  }\n}\n"): typeof import('./graphql').AdminCreateConversationFromPostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation AdminCreateConversationFromConversation($conversationId: ID!) {\n  adminCreateConversationFromConversation(conversationId: $conversationId) {\n    id\n    token\n  }\n}\n"): typeof import('./graphql').AdminCreateConversationFromConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminCreateConversation($model: ConversationModel!, $userID: ID!) {\n  adminCreateConversation(model: $model, userID: $userID) {\n    token\n  }\n}\n"): typeof import('./graphql').AdminCreateConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Post($id: ID!) {\n  node(id: $id) {\n    ... on Post {\n      id\n  type\n  title\n  createdAt\n  status\n  body\n  featured\n  insightsGeneratedAt\n  commentsDisabled\n  creditHours\n  topics {\n    id\n    name\n  }\n  topicClassifications {\n    id\n    modelVersion\n    topic {\n      id\n      name\n    }\n    active\n    suggested\n  }\n  audiences {\n    id\n    name\n  }\n  totalComments\n  totalLikes\n  totalBookmarks\n  termsPerMinute\n  author {\n    id\n    username\n    firstName\n    lastName\n    username\n    hasSubmittedDisclosure\n    hasDisclosuresNeedingReview\n    reflectionsOnAuthoredPostsDisabled\n    npiTaxonomyCode\n    npiTaxonomyDescription\n    credential\n    profileImage {\n      url\n    }\n  }\n  coverImage {\n    id\n    url\n  }\n  videos {\n    id\n    thumbnailURL\n    alternatePlaylists {\n      cdn\n      url\n    }\n    duration\n    width\n    height\n    hlsURL\n    insightsGeneratedAt\n    discussionPoints\n    terms\n    termFrequencies\n    termsPerMinute\n    wordcloud\n  }\n    }\n  }\n}\n"): typeof import('./graphql').PostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Users($where: UserWhereInput!) {\n  users(where: $where) {\n    edges {\n      node {\n        id\n        firstName\n        lastName\n        credential\n        npiTaxonomyCode\n        npiTaxonomyDescription\n        profileImage {\n          id\n          url\n          width\n          height\n        }\n      }\n  \t}\n  }\n}\n"): typeof import('./graphql').UsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery User($id: ID!) {\n  node(id: $id) {\n    __typename\n    ... on User {\n      id\n      firstName\n      lastName\n      credential\n      npiTaxonomyCode\n      npiTaxonomyDescription\n      profileImage {\n        id\n        url\n        width\n        height\n      }\n    }\n  }\n}\n"): typeof import('./graphql').UserDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

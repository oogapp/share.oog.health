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
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query CurrentUser {\n  currentUser {\n    id\n    streamToken\n    firstName\n    lastName\n  }\n}\n": types.CurrentUserDocument,
    "\n  query SparkyMessage($id: ID!) {\n  node(id: $id) {\n    ... on SparkyMessage {\n      conversation {\n        id\n      }\n      notHelpful\n      references {\n        citationKey\n        sourceTexts\n        referenceText\n        referenceDetail {\n          doi\n          url\n          title\n          journalName\n          authorsString\n          publicationDate\n          publicationInfoString\n        }\n      }\n    }\n  }\n}\n": types.SparkyMessageDocument,
    "\nquery SparkyMessages($where: SparkyMessageWhereInput!) {\n  sparkyMessages(where: $where) {\n    edges {\n      node {\n        id\n        body\n        notHelpful\n        conversation {\n          id\n        }\n        references {\n          citationKey\n          sourceTexts\n          referenceText\n          referenceDetail {\n            doi\n            url\n            title\n            journalName\n            authorsString\n            publicationDate\n            publicationInfoString\n          }\n        }\n      }\n    }\n  }\n}\n": types.SparkyMessagesDocument,
    "\nquery SparkyConversation($id: ID!) {\n  node(id: $id) {\n    ... on SparkyConversation {\n      id\n      token\n      model\n      createdAt\n      messages {\n        body\n        notHelpful\n      }\n      targetConversation {\n        id\n        token\n      }\n    }\n  }\n}\n": types.SparkyConversationDocument,
    "\nquery SparkyConversations($where: SparkyConversationWhereInput!) {\n  sparkyConversations(where: $where) {\n    edges {\n      node {\n        id\n        token\n        model\n        createdAt\n      \tmessages {\n          body\n          notHelpful\n        }\n      }\n  \t}\n  }\n}\n": types.SparkyConversationsDocument,
    "\nmutation AdminCreateConversationFromConversation($conversationId: ID!) {\n  adminCreateConversationFromConversation(conversationId: $conversationId) {\n    id\n    token\n  }\n}\n": types.AdminCreateConversationFromConversationDocument,
    "\n  mutation CreateConversation($model: ConversationModel!,$initialMessage:String) {\n  createConversation(model: $model,initialMessage:$initialMessage) {\n    token\n  }\n}\n": types.CreateConversationDocument,
    "\n  mutation ReflectOnConversation($conversationId: ID!) {\n  reflectOnConversation(conversationId: $conversationId) {\n    id\n  }\n}\n": types.ReflectOnConversationDocument,
    "\n  mutation FlagMessageNotHelpful($messageId: ID!) {\n  flagMessageNotHelpful(messageId: $messageId)\n}\n": types.FlagMessageNotHelpfulDocument,
    "\nquery Post($id: ID!) {\n  node(id: $id) {\n    ... on Post {\n      id\n  type\n  title\n  createdAt\n  status\n  body\n  featured\n  insightsGeneratedAt\n  commentsDisabled\n  creditHours\n  topics {\n    id\n    name\n  }\n  topicClassifications {\n    id\n    modelVersion\n    topic {\n      id\n      name\n    }\n    active\n    suggested\n  }\n  audiences {\n    id\n    name\n  }\n  totalComments\n  totalLikes\n  totalBookmarks\n  termsPerMinute\n  author {\n    id\n    username\n    firstName\n    lastName\n    username\n    hasSubmittedDisclosure\n    hasDisclosuresNeedingReview\n    reflectionsOnAuthoredPostsDisabled\n    npiTaxonomyCode\n    npiTaxonomyDescription\n    credential\n    profileImage {\n      url\n    }\n  }\n  coverImage {\n    id\n    url\n  }\n  videos {\n    id\n    thumbnailURL\n    alternatePlaylists {\n      cdn\n      url\n    }\n    duration\n    width\n    height\n    hlsURL\n    insightsGeneratedAt\n    discussionPoints\n    terms\n    termFrequencies\n    termsPerMinute\n    wordcloud\n  }\n    }\n  }\n}\n": types.PostDocument,
    "\nquery Users($where: UserWhereInput!) {\n  users(where: $where) {\n    edges {\n      node {\n        id\n        firstName\n        lastName\n        credential\n        npiTaxonomyCode\n        npiTaxonomyDescription\n        profileImage {\n          id\n          url\n          width\n          height\n        }\n      }\n  \t}\n  }\n}\n": types.UsersDocument,
    "\nquery User($id: ID!) {\n  node(id: $id) {\n    __typename\n    ... on User {\n      id\n      firstName\n      lastName\n      credential\n      npiTaxonomyCode\n      npiTaxonomyDescription\n      profileImage {\n        id\n        url\n        width\n        height\n      }\n    }\n  }\n}\n": types.UserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurrentUser {\n  currentUser {\n    id\n    streamToken\n    firstName\n    lastName\n  }\n}\n"): typeof import('./graphql').CurrentUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SparkyMessage($id: ID!) {\n  node(id: $id) {\n    ... on SparkyMessage {\n      conversation {\n        id\n      }\n      notHelpful\n      references {\n        citationKey\n        sourceTexts\n        referenceText\n        referenceDetail {\n          doi\n          url\n          title\n          journalName\n          authorsString\n          publicationDate\n          publicationInfoString\n        }\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SparkyMessageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery SparkyMessages($where: SparkyMessageWhereInput!) {\n  sparkyMessages(where: $where) {\n    edges {\n      node {\n        id\n        body\n        notHelpful\n        conversation {\n          id\n        }\n        references {\n          citationKey\n          sourceTexts\n          referenceText\n          referenceDetail {\n            doi\n            url\n            title\n            journalName\n            authorsString\n            publicationDate\n            publicationInfoString\n          }\n        }\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SparkyMessagesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery SparkyConversation($id: ID!) {\n  node(id: $id) {\n    ... on SparkyConversation {\n      id\n      token\n      model\n      createdAt\n      messages {\n        body\n        notHelpful\n      }\n      targetConversation {\n        id\n        token\n      }\n    }\n  }\n}\n"): typeof import('./graphql').SparkyConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery SparkyConversations($where: SparkyConversationWhereInput!) {\n  sparkyConversations(where: $where) {\n    edges {\n      node {\n        id\n        token\n        model\n        createdAt\n      \tmessages {\n          body\n          notHelpful\n        }\n      }\n  \t}\n  }\n}\n"): typeof import('./graphql').SparkyConversationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation AdminCreateConversationFromConversation($conversationId: ID!) {\n  adminCreateConversationFromConversation(conversationId: $conversationId) {\n    id\n    token\n  }\n}\n"): typeof import('./graphql').AdminCreateConversationFromConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateConversation($model: ConversationModel!,$initialMessage:String) {\n  createConversation(model: $model,initialMessage:$initialMessage) {\n    token\n  }\n}\n"): typeof import('./graphql').CreateConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReflectOnConversation($conversationId: ID!) {\n  reflectOnConversation(conversationId: $conversationId) {\n    id\n  }\n}\n"): typeof import('./graphql').ReflectOnConversationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FlagMessageNotHelpful($messageId: ID!) {\n  flagMessageNotHelpful(messageId: $messageId)\n}\n"): typeof import('./graphql').FlagMessageNotHelpfulDocument;
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

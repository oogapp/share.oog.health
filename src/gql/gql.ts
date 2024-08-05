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
    "\nquery Post($id: ID!) {\n  node(id: $id) {\n    ... on Post {\n      id\n  type\n  title\n  status\n  body\n  featured\n  insightsGeneratedAt\n  commentsDisabled\n  creditHours\n  topics {\n    id\n    name\n  }\n  topicClassifications {\n    id\n    modelVersion\n    topic {\n      id\n      name\n    }\n    active\n    suggested\n  }\n  audiences {\n    id\n    name\n  }\n  totalComments\n  totalLikes\n  totalBookmarks\n  termsPerMinute\n  author {\n    id\n    username\n    firstName\n    lastName\n    username\n    hasSubmittedDisclosure\n    hasDisclosuresNeedingReview\n    reflectionsOnAuthoredPostsDisabled\n    npiTaxonomyCode\n    npiTaxonomyDescription\n    credential\n    profileImage {\n      url\n    }\n  }\n  coverImage {\n    id\n    url\n  }\n  videos {\n    id\n    thumbnailURL\n    alternatePlaylists {\n      cdn\n      url\n    }\n    duration\n    width\n    height\n    hlsURL\n    insightsGeneratedAt\n    discussionPoints\n    terms\n    termFrequencies\n    termsPerMinute\n    wordcloud\n  }\n    }\n  }\n}\n": types.PostDocument,
    "\nquery User($id: ID!) {\n  node(id: $id) {\n    __typename\n    ... on User {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n": types.UserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Post($id: ID!) {\n  node(id: $id) {\n    ... on Post {\n      id\n  type\n  title\n  status\n  body\n  featured\n  insightsGeneratedAt\n  commentsDisabled\n  creditHours\n  topics {\n    id\n    name\n  }\n  topicClassifications {\n    id\n    modelVersion\n    topic {\n      id\n      name\n    }\n    active\n    suggested\n  }\n  audiences {\n    id\n    name\n  }\n  totalComments\n  totalLikes\n  totalBookmarks\n  termsPerMinute\n  author {\n    id\n    username\n    firstName\n    lastName\n    username\n    hasSubmittedDisclosure\n    hasDisclosuresNeedingReview\n    reflectionsOnAuthoredPostsDisabled\n    npiTaxonomyCode\n    npiTaxonomyDescription\n    credential\n    profileImage {\n      url\n    }\n  }\n  coverImage {\n    id\n    url\n  }\n  videos {\n    id\n    thumbnailURL\n    alternatePlaylists {\n      cdn\n      url\n    }\n    duration\n    width\n    height\n    hlsURL\n    insightsGeneratedAt\n    discussionPoints\n    terms\n    termFrequencies\n    termsPerMinute\n    wordcloud\n  }\n    }\n  }\n}\n"): typeof import('./graphql').PostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery User($id: ID!) {\n  node(id: $id) {\n    __typename\n    ... on User {\n      id\n      firstName\n      lastName\n    }\n  }\n}\n"): typeof import('./graphql').UserDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

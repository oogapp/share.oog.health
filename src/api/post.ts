import { graphql } from '@/gql';
import { Post, PostQuery } from '@/gql/graphql';
import { GraphQLClient } from 'graphql-request';
import { cache } from 'react';

const GetPostQuery = graphql(`
query Post($id: ID!) {
  node(id: $id) {
    ... on Post {
      id
  type
  title
  createdAt
  status
  body
  featured
  insightsGeneratedAt
  commentsDisabled
  creditHours
  topics {
    id
    name
  }
  topicClassifications {
    id
    modelVersion
    topic {
      id
      name
    }
    active
    suggested
  }
  audiences {
    id
    name
  }
  totalComments
  totalLikes
  totalBookmarks
  termsPerMinute
  author {
    id
    username
    firstName
    lastName
    username
    hasSubmittedDisclosure
    hasDisclosuresNeedingReview
    reflectionsOnAuthoredPostsDisabled
    npiTaxonomyCode
    npiTaxonomyDescription
    credential
    profileImage {
      url
    }
  }
  coverImage {
    id
    url
  }
  videos {
    id
    thumbnailURL
    alternatePlaylists {
      cdn
      url
    }
    duration
    width
    height
    hlsURL
    insightsGeneratedAt
    discussionPoints
    terms
    termFrequencies
    termsPerMinute
    wordcloud
  }
    }
  }
}
`)

const client = new GraphQLClient(process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT!,{fetch})

async function getPost(id: string): Promise<Post> {
  console.log("getPost", id);
  let resp: PostQuery = await client.request(GetPostQuery.toString(), { id });
  return resp.node as Post;
}

const getPostCached = cache(getPost);
export { getPostCached as getPost };

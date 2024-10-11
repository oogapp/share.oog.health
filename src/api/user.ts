import { graphql } from "@/gql";
import { User, UserQuery, UsersQuery } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cache } from "react";

const GetUsersByUsernameQuery = graphql(`
query Users($where: UserWhereInput!) {
  users(where: $where) {
    edges {
      node {
        id
        firstName
        lastName
        credential
        npiTaxonomyCode
        npiTaxonomyDescription
        profileImage {
          id
          url
          width
          height
        }
      }
  	}
  }
}
`)

const GetUserQuery = graphql(`
query User($id: ID!) {
  node(id: $id) {
    __typename
    ... on User {
      id
      firstName
      lastName
      credential
      npiTaxonomyCode
      npiTaxonomyDescription
      profileImage {
        id
        url
        width
        height
      }
    }
  }
}
`)

const client = new GraphQLClient(process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT!,{fetch})

async function getUser(id: string): Promise<User> {
    let resp: UserQuery = await client.request(GetUserQuery.toString(), { id });
    return resp.node as User;
}

async function getUserByUsername(username: string): Promise<User> {
    let resp: UsersQuery = await client.request(GetUsersByUsernameQuery.toString(), { where: { usernameEqualFold: username } },{
        Authorization: `Bearer 7IIVpApKFtzvG7HLjPzQJ7uenpgpTtBc`
    });

    let edges = resp.users.edges;
    if(edges && edges.length > 0) {
        return edges[0]?.node as User;
    }
    return {} as User;
}

const getUserCached = cache(getUser);
const getUserByUsernameCached = cache(getUserByUsername);
export { getUserCached as getUser, getUserByUsernameCached as getUserByUsername };


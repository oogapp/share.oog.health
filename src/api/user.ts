import { graphql } from "@/gql";
import { User, UserQuery } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cache } from "react";

const GetUserQuery = graphql(`
query User($id: ID!) {
  node(id: $id) {
    __typename
    ... on User {
      id
      firstName
      lastName
    }
  }
}
`)

const client = new GraphQLClient(process.env.NEXT_PUBLIC_OOG_GRAPHQL_API_ENDPOINT!,{fetch})

async function getUser(id: string): Promise<User> {
    console.log("getUser", id);
    let resp: UserQuery = await client.request(GetUserQuery.toString(), { id });
    return resp.node as User;
}

const getUserCached = cache(getUser);
export { getUserCached as getUser };


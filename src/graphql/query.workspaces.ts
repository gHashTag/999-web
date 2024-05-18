import { gql } from "@apollo/client";

// export const CURRENT_USER = gql`
//   query CurrentUser {
//     isLoggedIn @client
//     user_id @client
//     first_name @client
//     last_name @client
//   }
// `;

export const WORKSPACES_COLLECTION_QUERY = gql`
  query WorkspacesCollection($user_id: UUID!) {
    workspacesCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id
          user_id
          workspace_id
          colors
          background
          title
          type
          updated_at
          created_at
        }
      }
    }
  }
`;

export const MY_WORKSPACE_COLLECTION_QUERY = gql`
  query MyWorkspaceCollection($user_id: UUID!) {
    workspacesCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id
          user_id
          workspace_id
          colors
          background
          title
          type
          updated_at
          created_at
        }
      }
    }
  }
`;

export const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspaces($objects: [workspacesInsertInput!]!) {
    insertIntoworkspacesCollection(objects: $objects) {
      records {
        id
        user_id
        created_at
        title
        description
        updated_at
      }
    }
  }
`;

export const WORKSPACE_UPDATE_MUTATION = gql`
  mutation updateworkspacesCollection(
    $id: BigInt!
    $status: BigInt!
    $title: String!
    $description: String!
    $updated_at: Datetime!
    $order: BigInt!
  ) {
    updatetasksCollection(
      filter: { id: { eq: $id } }
      set: {
        status: $status
        updated_at: $updated_at
        title: $title
        description: $description
        order: $order
      }
    ) {
      records {
        id
        user_id
        title
        description
        status
        due_date
        completed_at
        is_archived
        updated_at
        created_at
        label
        priority
        order
      }
    }
  }
`;

export const WORKSPACE_DELETE_MUTATION = gql`
  mutation DeleteWorkspace($filter: workspacesFilter!, $atMost: Int!) {
    deleteFromworkspacesCollection(filter: $filter, atMost: $atMost) {
      records {
        id
        title
      }
    }
  }
`;

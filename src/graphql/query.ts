import { gql } from "@apollo/client";

// export const CURRENT_USER = gql`
//   query CurrentUser {
//     isLoggedIn @client
//     user_id @client
//     first_name @client
//     last_name @client
//   }
// `;

export const ROOM_INFO = gql`
  query RoomInfo {
    room_id @client
    room_name @client
    room_type @client
  }
`;

export const ROOMS_BY_ID_COLLECTION_QUERY = gql`
  query RoomsCollectionByName($room_id: String!) {
    roomsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          user_id
          workspace_id
          name
          username
          description
          updated_at
          created_at
          type
          enabled
          description
          codes
          room_id
        }
      }
    }
  }
`;

export const ROOMS_COLLECTION_QUERY = gql`
  query RoomsCollectionByName($workspace_id: UUID!) {
    roomsCollection(
      filter: {
        workspace_id: { eq: $workspace_id }
        workspace_id: { eq: $workspace_id }
      }
    ) {
      edges {
        node {
          id
          user_id
          workspace_id
          name
          username
          description
          updated_at
          created_at
          type
          enabled
          description
          codes
          room_id
        }
      }
    }
  }
`;

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

export const GET_ALL_TASKS_QUERY = gql`
  query GetRoomTasks {
    tasksCollection(orderBy: { created_at: DescNullsFirst }) {
      edges {
        node {
          id
          user_id
          workspace_id
          room_id
          recording_id
          created_at
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
        }
      }
    }
  }
`;

export const GET_USER_TASKS_QUERY = gql`
  query GetUserTasks($user_id: UUID!) {
    tasksCollection(
      filter: { and: [{ user_id: { eq: $user_id } }] }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          user_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
        }
      }
    }
  }
`;

export const GET_ROOM_TASKS_QUERY = gql`
  query GetRoomTasks($user_id: UUID!, $workspace_id: UUID!) {
    tasksCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id }, user_id: { eq: $user_id } }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          user_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
        }
      }
    }
  }
`;

export const GET_RECORDING_TASKS_QUERY = gql`
  query GetRoomTasks($user_id: UUID!, $room_id: String!, $workspace_id: UUID!) {
    tasksCollection(
      filter: {
        and: [
          {
            workspace_id: { eq: $workspace_id }
            user_id: { eq: $user_id }
            room_id: { eq: $room_id }
          }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          user_id
          workspace_id
          room_id
          created_at
          title
          description
          recording_id
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
        }
      }
    }
  }
`;

export const ROOM_NAME_COLLECTION_QUERY = gql`
  query RoomsCollectionByName($room_id: String!) {
    roomsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          user_id
          name
          description
          updated_at
          created_at
          type
          enabled
          description
          codes
          room_id
        }
      }
    }
  }
`;

export const ROOMS_ASSETS_COLLECTION_QUERY = gql`
  query RoomAssetsCollection($room_id: String!) {
    room_assetsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          title
          summary_short
          recording_id
          transcription
          room_id
        }
      }
    }
  }
`;

export const DELETE_ROOM_MUTATION = gql`
  mutation DeleteFromroomsCollection($room_id: String!) {
    deleteFromroomsCollection(filter: { room_id: { eq: $room_id } }) {
      records {
        id
      }
    }
  }
`;

export const TASKS_COLLECTION_QUERY = gql`
  query GetTasks(
    $user_id: UUID!
    $room_id: String!
    $recording_id: String
    $workspace_id: UUID!
  ) {
    tasksCollection(
      filter: {
        and: [
          {
            workspace_id: { eq: $workspace_id }
            user_id: { eq: $user_id }
            room_id: { eq: $room_id }
            recording_id: { eq: $recording_id }
          }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          user_id
          workspace_id
          room_id
          recording_id
          created_at
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
        }
      }
    }
  }
`;

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTasks($objects: [tasksInsertInput!]!) {
    insertIntotasksCollection(objects: $objects) {
      records {
        id
        user_id
        created_at
        title
        description
        updated_at
        due_date
        priority
        assigned_to
        completed_at
        is_archived
        status
        order
        label
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

export const MUTATION_TASK_STATUS_UPDATE = gql`
  mutation updatetasksCollection(
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
        assigned_to
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

export const MUTATION_TASK_UPDATE = gql`
  mutation updatetasksCollection(
    $id: BigInt!
    $status: String!
    $label: String!
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
        label: $label
      }
    ) {
      records {
        id
        user_id
        title
        description
        status
        due_date
        assigned_to
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
        assigned_to
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

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($filter: tasksFilter!, $atMost: Int!) {
    deleteFromtasksCollection(filter: $filter, atMost: $atMost) {
      records {
        id
        title
      }
    }
  }
`;

export const GET_ROOM_ASSETS = gql`
  query RoomAssetsCollection($recording_id: String!) {
    room_assetsCollection(filter: { recording_id: { eq: $recording_id } }) {
      edges {
        node {
          id
          title
          summary_short
          transcription
          recording_id
        }
      }
    }
  }
`;

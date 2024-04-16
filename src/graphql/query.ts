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

export const GET_ROOMS_COLLECTIONS_BY_ROOM_ID_QUERY = gql`
  query RoomsCollection($room_id: String!) {
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
          chat_id
        }
      }
    }
  }
`;

export const GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY = gql`
  query RoomsCollection($workspace_id: String!, $user_id: UUID!) {
    roomsCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id } }
          { user_id: { eq: $user_id } }
        ]
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
          chat_id
        }
      }
    }
  }
`;

export const GET_ROOMS_COLLECTIONS_BY_USER_ID_QUERY = gql`
  query RoomsCollection($user_id: UUID!) {
    roomsCollection(filter: { user_id: { eq: $user_id } }) {
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
          chat_id
        }
      }
    }
  }
`;

export const GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY = gql`
  query RoomsCollection(
    $workspace_id: String!
    $room_id: String!
    $user_id: UUID!
  ) {
    roomsCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id } }
          { room_id: { eq: $room_id } }
          { user_id: { eq: $user_id } }
        ]
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
          chat_id
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

export const GET_ALL_PASSPORTS_QUERY = gql`
  query GetAllPassports {
    user_passportCollection {
      edges {
        node {
          user_id
          username
          photo_url
          workspace_id
          room_id
          recording_id
        }
      }
    }
  }
`;

export const GET_USER_PASSPORTS_QUERY = gql`
  query GetRoomPassport($user_id: UUID!) {
    user_passportCollection(filter: { and: [{ user_id: { eq: $user_id } }] }) {
      edges {
        node {
          user_id
          username
          photo_url
          workspace_id
          room_id
          recording_id
        }
      }
    }
  }
`;

export const GET_WORKSPACE_PASSPORTS_QUERY = gql`
  query GetRoomPassport($user_id: UUID!, $workspace_id: UUID!) {
    user_passportCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id }, user_id: { eq: $user_id } }
        ]
      }
    ) {
      edges {
        node {
          user_id
          username
          photo_url
          workspace_id
          room_id
          recording_id
        }
      }
    }
  }
`;

export const GET_ROOM_PASSPORTS_QUERY = gql`
  query GetRoomPassport(
    $user_id: UUID!
    $room_id: String!
    $workspace_id: UUID!
  ) {
    user_passportCollection(
      filter: {
        and: [
          {
            workspace_id: { eq: $workspace_id }
            user_id: { eq: $user_id }
            room_id: { eq: $room_id }
          }
        ]
      }
    ) {
      edges {
        node {
          user_id
          username
          photo_url
          workspace_id
          room_id
          recording_id
        }
      }
    }
  }
`;

export const PASSPORT_COLLECTION_QUERY = gql`
  query GetPassports(
    $user_id: UUID!
    $room_id: String!
    $recording_id: String
    $workspace_id: UUID!
  ) {
    user_passportCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id } }
          { user_id: { eq: $user_id } }
          { room_id: { eq: $room_id } }
          { recording_id: { eq: $recording_id } }
        ]
      }
    ) {
      edges {
        node {
          user_id
          workspace_id
          room_id
          recording_id
        }
      }
    }
  }
`;

export const PASSPORT_CREATE_MUTATION = gql`
  mutation CreatePassport($objects: [user_passportInsertInput!]!) {
    insertIntouser_passportCollection(objects: $objects) {
      records {
        user_id
        workspace_id
        room_id
        recording_id
        photo_url
      }
    }
  }
`;

export const PASSPORT_UPDATE_MUTATION = gql`
  mutation updatePassport(
    $user_id: UUID!
    $passport_id: BigIntFilter
    $workspace_id: UUID!
    $room_id: String!
    $recording_id: String!
  ) {
    updateuser_passportCollection(
      filter: { passport_id: $passport_id }
      set: {
        workspace_id: $workspace_id
        room_id: $room_id
        recording_id: $recording_id
        user_id: $user_id
      }
    ) {
      records {
        user_id
        workspace_id
        room_id
        recording_id
      }
    }
  }
`;

export const PASSPORT_DELETE_MUTATION = gql`
  mutation DeletePassport($passport_id: BigInt!) {
    deleteFromuser_passportCollection(
      filter: { passport_id: { eq: $passport_id } }
    ) {
      records {
        user_id
        workspace_id
        room_id
        recording_id
      }
    }
  }
`;

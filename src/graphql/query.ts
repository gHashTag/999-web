import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query CurrentUser {
    isLoggedIn @client
    user_id @client
    first_name @client
    last_name @client
    email @client
  }
`;

export const ROOM_INFO = gql`
  query RoomInfo {
    room_id @client
    room_name @client
    room_type @client
  }
`;

export const ROOMS_COLLECTION_QUERY = gql`
  query RoomsCollectionByName($user_id: String!, $room_id: String!) {
    roomsCollection(filter: { user_id: { eq: $user_id }, room_id: { eq: $room_id } }) {
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
query GetTasks($user_id: UUID!) {
  tasksCollection(filter: {
    and: [
      {user_id: {eq: $user_id}}
    ]
  }, orderBy: {
      created_at: DescNullsFirst
    }) {
    edges {
      node {
        id
        user_id
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

export const MUTATION_TASK_UPDATE = gql`
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

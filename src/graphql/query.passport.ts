import { gql } from "@apollo/client";

export const PASSPORT_COLLECTION_QUERY = gql`
query GetPassports($user_id: UUID!, $room_id: String!, $recording_id: String, $workspace_id: UUID!, $is_owner: Boolean!,  $type: String!, $task_id: BigInt!) {
  user_passportCollection(
    filter: {
      and: [
        { workspace_id: { eq: $workspace_id } },
        { user_id: { eq: $user_id } },
        { room_id: { eq: $room_id } },
        { recording_id: { eq: $recording_id } },
        { is_owner: { eq: $is_owner } },
        { type: { eq: $type } }
        { task_id: { eq: $task_id } }
      ]
    }
  ) {
    edges {
      node {
        passport_id
        user_id
        username
        first_name
        last_name
        workspace_id
        room_id
        recording_id
        photo_url
        is_owner
        room_id
        type
        task_id
        rooms {
          name
          chat_id
          type
          codes
        }
      }
    }
  }
}
`;
export const PASSPORT_COLLECTION_BY_TASK_ID_QUERY = gql`
query GetPassports($task_id: BigInt!) {
  user_passportCollection(
    filter: {
      and: [
        { task_id: { eq: $task_id } },
      ]
    }
  ) {
    edges {
      node {
        passport_id
        user_id
        username
        first_name
        last_name
        workspace_id
        room_id
        recording_id
        photo_url
        is_owner
        room_id
        type
      }
    }
  }
}
`;

export const PASSPORT_COLLECTION_IS_NOT_OWNER_QUERY = gql`
query GetPassports($user_id: UUID!, $room_id: String!, $recording_id: String, $workspace_id: UUID!, $is_owner: Boolean!, $type: String!) {
  user_passportCollection(
    filter: {
      and: [
        { workspace_id: { eq: $workspace_id } },
        { user_id: { eq: $user_id } },
        { room_id: { eq: $room_id } },
        { recording_id: { eq: $recording_id } },
        { is_owner: { eq: $is_owner } },
        { type: { eq: $type } }
      ]
    }
  ) {
    edges {
      node {
        passport_id
        user_id
        username
        first_name
        last_name
        workspace_id
        room_id
        recording_id
        photo_url
        is_owner
        room_id
        type
        rooms {
          name
          chat_id
          type
          codes
        }
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
        username
        first_name
        last_name
        room_id
        recording_id
        photo_url
        passport_id
        is_owner
      }
    }
  }
`;

export const PASSPORT_UPDATE_MUTATION = gql`
  mutation updatePassport(
    $user_id: UUID!
    $passport_id: BigIntFilter
    $workspace_id: UUID!
    $room_id: Number!
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
        username
        workspace_id
        room_id
        recording_id
        passport_id
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
        passport_id
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

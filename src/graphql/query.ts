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
  query RoomsCollectionByName($user_id: String!) {
    roomsCollection(filter: { user_id: { eq: $user_id } }) {
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

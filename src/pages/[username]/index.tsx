"use client";
import { useEffect } from "react";

import { TonConnectButton } from "@tonconnect/ui-react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

import { FieldValues } from "react-hook-form";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";

import { useToast } from "@/components/ui/use-toast";
import { SignupFormDemo } from "@/components/ui/signup-form";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Spinner } from "@/components/ui/spinner";
import { setHeaderName } from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";
import { captureExceptionSentry } from "@/utils/sentry";

const QUERY = gql`
  query GetUserByEmail($username: String!) {
    usersCollection(filter: { username: { eq: $username } }) {
      edges {
        node {
          user_id
          first_name
          last_name
          username
          photo_url
          designation
          company
          position
        }
      }
    }
  }
`;

const MUTATION = gql`
  mutation UpdateUser(
    $user_id: UUID
    $first_name: String!
    $last_name: String!
    $designation: String!
    $company: String!
    $position: String!
  ) {
    updateusersCollection(
      filter: { user_id: { eq: $user_id } }
      set: {
        first_name: $first_name
        last_name: $last_name
        designation: $designation
        company: $company
        position: $position
      }
    ) {
      records {
        id
        first_name
        last_name
        username
        photo_url
        user_id
        company
        position
      }
    }
  }
`;

export type updateUserDataType = {
  user_id: string;
  first_name: string;
  last_name: string;
  designation: string;
};

export default function Wallet() {
  const router = useRouter();
  const { username } = useUser();

  useEffect(() => {
    if (!username) {
      console.log("no username");
      router.push("/");
    } else {
      localStorage.setItem("is_owner", "true");
      setHeaderName("Wallet");
    }
  }, [router, username]);

  const { toast } = useToast();

  const [mutateUser, { loading: mutationLoading, error: mutationError }] =
    useMutation(MUTATION);

  if (mutationError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutationError.message);
  }

  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: {
      username,
    },
  });

  if (error) return <p>Error : {error.message}</p>;

  const userNode = data?.usersCollection?.edges[0]?.node;

  const handleFormData = (data: FieldValues) => {
    try {
      if (data) {
        const variables = {
          user_id: userNode.user_id,
          first_name: data?.first_name,
          last_name: data?.last_name,
          designation: data?.designation,
          company: data?.company,
          position: data?.position,
          username: username,
        };

        if (variables.first_name && variables.last_name) {
          mutateUser({
            variables,
            onCompleted: () => {
              refetch();
            },
          });
        }
      }
    } catch (error) {
      captureExceptionSentry("Error updating user", "[username]");
      toast({
        variant: "destructive",
        title: "Closed access",
        description: JSON.stringify(error),
      });
    }
  };

  return (
    <Layout loading={loading}>
      <main className="flex flex-col items-center justify-between p-14">
        <div style={{ padding: "10px" }} />

        {loading && <Spinner size="lg" />}

        {!loading && userNode && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                marginRight: 20,
                flexDirection: "column",
              }}
            >
              <AnimatedTooltip
                items={[
                  {
                    id: 1,
                    name: `${userNode?.username}`,
                    designation: userNode?.position,
                    image: userNode?.photo_url,
                  },
                ]}
              />
              <div style={{ padding: "10px" }} />
              <TonConnectButton style={{ marginLeft: 12 }} />
            </div>

            <SignupFormDemo
              first_name={userNode.first_name}
              last_name={userNode.last_name}
              position={userNode.position}
              company={userNode.company}
              designation={userNode.designation}
              // logout={logout}
              onSubmit={handleFormData}
            />
          </>
        )}
        <div style={{ padding: "20px" }} />
      </main>
    </Layout>
  );
}

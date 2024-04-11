"use client";
import { useEffect, useState } from "react";

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
// @ts-ignore
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "@/components/ui/moving-border";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";

import { useToast } from "@/components/ui/use-toast";
import { SignupFormDemo } from "@/components/ui/signup-form";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Spinner } from "@/components/ui/spinner";

import { CanvasRevealEffectDemo } from "@/components/ui/canvas-reveal-effect-demo";
import {
  CREATE_WORKSPACE_MUTATION,
  DELETE_TASK_MUTATION,
  MUTATION_WORKSPACE_UPDATE,
  WORKSPACES_COLLECTION_QUERY,
} from "@/graphql/query";
import WorkspaceModal from "@/components/modal/WorkspaceModal";
import { useDisclosure } from "@nextui-org/react";
import { useSupabase } from "@/hooks/useSupabase";

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

export default function Office() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");

  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { getTaskById, getSupabaseUser } = useSupabase();

  useEffect(() => {
    if (!username) {
      router.push("/");
    }
  }, [router]);

  const {
    data: workspacesData,
    loading,
    error: workspacesError,
    refetch,
  } = useQuery(WORKSPACES_COLLECTION_QUERY, {
    variables: {
      user_id,
    },
  });

  if (workspacesError) return <p>Error : {workspacesError.message}</p>;

  const workspaceNode = workspacesData?.workspacesCollection?.edges;

  const [
    mutateUpdateWorkspaceStatus,
    { error: mutateUpdateWorkspaceStatusError },
  ] = useMutation(MUTATION_WORKSPACE_UPDATE, {
    variables: {
      username,
    },
  });

  if (mutateUpdateWorkspaceStatusError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateUpdateWorkspaceStatusError.message);
  }

  const [mutateCreateWorkspace, { error: mutateCreateWorkspaceError }] =
    useMutation(CREATE_WORKSPACE_MUTATION);

  if (mutateCreateWorkspaceError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log("mutateCreateTaskError", mutateCreateWorkspaceError.message);
  }

  const [deleteTask, { error: deleteTaskError }] =
    useMutation(DELETE_TASK_MUTATION);

  const goToOffice = (workspace_id: string) => {
    router.push(`/${workspace_id}`);
    localStorage.setItem("workspace_id", workspace_id);
  };

  const onCreateNewWorkspace = () => {
    setValue("title", "");
    setValue("description", "");
    onOpen();
    setIsEditing(false);
  };

  const onCreate = async () => {
    try {
      const formData = getValues();

      if (username) {
        const formDataWithUserId = {
          ...formData,
          user_id,
        };

        const mutateCreateWorkspaceResult = await mutateCreateWorkspace({
          variables: {
            objects: [formDataWithUserId],
          },
          onCompleted: () => {
            toast({
              title: "Workspace created",
              description: "Workspace created successfully",
            });
            refetch();

            reset({
              title: "",
              description: "",
              label: "",
            });
          },
        });
      } else {
        console.log("Некорректное значение для username");
      }
    } catch (error) {
      console.log(error, "error");
      toast({
        title: "Error creating workspace:",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(mutateCreateWorkspaceError, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };

  const closeModal = () => {
    setOpenModalId(null);
    onClose();
  };

  const onDelete = (id: string) => {
    deleteTask({
      variables: {
        filter: {
          id: {
            eq: Number(id),
          },
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
    closeModal();
  };

  const onUpdate = () => {
    const formData = getValues();

    const variables = {
      id: openModalId,
      title: formData.title,
      description: formData.description,
      updated_at: new Date().toISOString(),
    };

    mutateUpdateWorkspaceStatus({
      variables,
      onCompleted: () => {
        refetch();
      },
    });
  };

  return (
    <Layout loading={loading}>
      <main className="flex flex-col items-center justify-between p-14">
        {loading && <Spinner size="lg" />}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-10  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20 text-center">
              Workspaces
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", top: 60, right: 30 }}>
          <Button onClick={onCreateNewWorkspace}>Create workspace</Button>
        </div>
        {isOpen && (
          <WorkspaceModal
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            onCreate={onCreate}
            onDelete={() => openModalId && onDelete(openModalId)}
            onUpdate={onUpdate}
            control={control}
            handleSubmit={handleSubmit}
            getValues={getValues}
            setValue={setValue}
            isEditing={isEditing}
          />
        )}
        {!loading && (
          <CanvasRevealEffectDemo
            officeData={workspaceNode || []}
            onClick={(workspace_id) => goToOffice(workspace_id)}
          />
        )}

        <div style={{ padding: "10px" }} />
      </main>
    </Layout>
  );
}

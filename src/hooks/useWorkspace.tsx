import { useToast } from "@/components/ui/use-toast";
import {
  CREATE_WORKSPACE_MUTATION,
  WORKSPACE_DELETE_MUTATION,
  WORKSPACE_UPDATE_MUTATION,
  WORKSPACES_COLLECTION_QUERY,
} from "@/graphql/query";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useDisclosure } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "./useUser";

const useWorkspace = () => {
  const { user_id, username } = useUser();
  const { toast } = useToast();
  const { onClose } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const {
    data: workspacesData,
    loading: workspacesLoading,
    error: workspacesError,
    refetch: workspacesRefetch,
  } = useQuery(WORKSPACES_COLLECTION_QUERY, {
    variables: {
      user_id,
    },
  });

  const workspaceNode = workspacesData?.workspacesCollection?.edges;

  const [mutateCreateWorkspace, { error: mutateCreateWorkspaceError }] =
    useMutation(CREATE_WORKSPACE_MUTATION);

  if (mutateCreateWorkspaceError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(
      "mutateCreateWorkspaceError",
      mutateCreateWorkspaceError.message
    );
  }

  const [mutateUpdateWorkspace, { error: mutateUpdateWorkspaceError }] =
    useMutation(WORKSPACE_UPDATE_MUTATION, {
      variables: {
        username,
      },
    });

  if (mutateUpdateWorkspaceError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateUpdateWorkspaceError.message);
  }

  const [mutateDeleteWorkspace, { error: mutateDeleteWorkspaceError }] =
    useMutation(WORKSPACE_DELETE_MUTATION, {
      variables: {
        username,
      },
    });

  if (mutateDeleteWorkspaceError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateDeleteWorkspaceError.message);
  }

  const onCreate = async () => {
    try {
      const formData = getValues();

      const formDataWithUserId = {
        ...formData,
        user_id,
      };

      const mutateCreateTaskResult = await mutateCreateWorkspace({
        variables: {
          objects: [formDataWithUserId],
        },
        onCompleted: () => {
          toast({
            title: "Workspace created",
            description: "Workspace created successfully",
          });
          workspacesRefetch();

          reset({
            title: "",
            description: "",
            label: "",
          });
        },
      });
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

  const onUpdate = () => {
    const formData = getValues();

    const variables = {
      id: openModalId,
      title: formData.title,
      description: formData.description,
      updated_at: new Date().toISOString(),
    };

    mutateUpdateWorkspace({
      variables,
      onCompleted: () => {
        workspacesRefetch();
      },
    });
  };

  const onDelete = (id: string) => {
    mutateDeleteWorkspace({
      variables: {
        filter: {
          id: {
            eq: Number(id),
          },
        },
      },
      onCompleted: () => {
        workspacesRefetch();
      },
    });
    closeModal();
  };

  const closeModal = useCallback(() => {
    setOpenModalId(null);
    onClose();
  }, [onClose]);

  return {
    workspacesData: workspaceNode,
    workspacesLoading,
    workspacesError,
    workspacesRefetch,
    control,
    handleSubmit,
    setValue,
    getValues,
    onCreate,
    onDelete,
    onUpdate,
  };
};

export { useWorkspace };

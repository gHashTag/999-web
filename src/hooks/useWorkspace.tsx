import { useToast } from "@/components/ui/use-toast";
import {
  CREATE_WORKSPACE_MUTATION,
  MY_WORKSPACE_COLLECTION_QUERY,
  WORKSPACE_DELETE_MUTATION,
  WORKSPACE_UPDATE_MUTATION,
  WORKSPACES_COLLECTION_QUERY,
} from "@/graphql/query.workspaces";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useDisclosure } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "./useUser";
import { WorkspaceArray } from "@/types";
import { captureExceptionSentry } from "@/utils/sentry";

const useWorkspace = (): UseWorkspaceReturn => {
  const { user_id, username } = useUser();
  const { toast } = useToast();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const {
    data: myWorkspaceData,
    loading: myWorkspaceLoading,
    error: myWorkspaceError,
    refetch: myWorkspaceRefetch,
  } = useQuery(MY_WORKSPACE_COLLECTION_QUERY, {
    variables: {
      user_id,
    },
  });

  const myWorkspaceNode = myWorkspaceData?.workspacesCollection?.edges;

  const [openModalWorkspaceId, setOpenModalWorkspaceId] = useState<
    number | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const workspaceNode = workspacesData?.workspacesCollection?.edges[0];

  const myWorkspace = workspaceNode && workspaceNode;

  let welcomeMenu: WorkspaceArray = [];

  if (myWorkspace) {
    welcomeMenu.push(myWorkspace);
  }

  welcomeMenu.push(
    {
      __typename: "workspacesEdge",
      node: {
        __typename: "workspaces",
        background: "bg-sky-600",
        colors: [["125", "211", "252"]],
        created_at: "2024-04-10T15:39:50.949122+00:00",
        id: "2",
        title: "Water",
        type: "water",
        updated_at: "2024-04-10T15:39:50.949122+00:00",
        user_id: "ec0c948a-2b96-4ccd-942f-0a991d78a94f",
        workspace_id: "54dc9d0e-dd96-43e7-bf72-02c2807f8977",
      },
    },
    {
      __typename: "workspacesEdge",
      node: {
        __typename: "workspaces",
        background: "bg-black",
        colors: [
          ["236", "72", "153"],
          ["232", "121", "249"],
        ],
        created_at: "2024-04-10T15:39:50.949122+00:00",
        id: "4",
        title: "Earth",
        type: "earth",
        updated_at: "2024-04-10T15:39:50.949122+00:00",
        user_id: "ec0c948a-2b96-4ccd-942f-0a991d78a94f",
        workspace_id: "d696abd8-3b7a-46f2-907f-5342a2b533a0",
      },
    }
  );

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

  const onCreateWorkspace = async () => {
    try {
      const formData = getValues();

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
          workspacesRefetch();

          reset({
            title: "",
            description: "",
            label: "",
          });
        },
      });
    } catch (error) {
      captureExceptionSentry("Error creating workspace", "useWorkspace");
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

  const onUpdateWorkspace = () => {
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

  const onDeleteWorkspace = (id: number) => {
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
    isOpenModalWorkspace: isOpen,
    onOpenModalWorkspace: onOpen,
    onOpenChangeModalWorkspace: onOpenChange,
    onCreateWorkspace,
    onDeleteWorkspace,
    onUpdateWorkspace,
    setValueWorkspace: setValue,
    controlWorkspace: control,
    handleSubmitWorkspace: handleSubmit,
    getValuesWorkspace: getValues,
    openModalWorkspaceId,
    setOpenModalWorkspaceId,
    isEditingWorkspace: isEditing,
    setIsEditingWorkspace: setIsEditing,
    welcomeMenu,
  };
};

type UseWorkspaceReturn = {
  workspacesData: WorkspaceArray;
  workspacesLoading: boolean;
  workspacesError: any;
  workspacesRefetch: () => void;
  isOpenModalWorkspace: boolean;
  onOpenModalWorkspace: () => void;
  onOpenChangeModalWorkspace: () => void;
  onCreateWorkspace: () => void;
  onUpdateWorkspace: () => void;
  onDeleteWorkspace: (id: number) => void;
  setValueWorkspace: (id: string, value: any) => void;
  controlWorkspace: any;
  handleSubmitWorkspace: any;
  getValuesWorkspace: any;
  openModalWorkspaceId: number | null;
  setOpenModalWorkspaceId: (id: number | null) => void;
  isEditingWorkspace: boolean;
  setIsEditingWorkspace: (isEditing: boolean) => void;
  welcomeMenu: WorkspaceArray;
};

export { useWorkspace };

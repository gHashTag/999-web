import { useToast } from "@/components/ui/use-toast";
import {
  PASSPORT_COLLECTION_BY_TASK_ID_QUERY,
  PASSPORT_COLLECTION_IS_NOT_OWNER_QUERY,
  PASSPORT_COLLECTION_QUERY,
  PASSPORT_CREATE_MUTATION,
  PASSPORT_DELETE_MUTATION,
  PASSPORT_UPDATE_MUTATION,
} from "@/graphql/query.passport";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useDisclosure } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "./useUser";
import { AssignedTo, Passport, PassportNode } from "@/types";

import { useTasks } from "./useTasks";
import { captureExceptionSentry } from "@/utils/sentry";
import { checkUsernameAndReturnUser } from "@/utils/supabase";

type passportType = {
  user_id?: string;
  room_id?: string | null | undefined;
  recording_id?: string;
  task_id?: string;
  type?: string;
  // assigned_to?: AssignedTo[];
};

const usePassport = ({
  room_id,
  recording_id,
  task_id,
  type,
}: // assigned_to,
passportType): UsePassportReturn => {
  const { username, user_id, is_owner, workspace_id, workspace_type } =
    useUser();
  // console.log(username, "username");
  // console.log(user_id, "user_id");
  // console.log(workspace_id, "workspace_id");
  // console.log(room_id, "room_id");
  // console.log(recording_id, "recording_id");
  // console.log(is_owner, "is_owner");
  // console.log(task_id, "task_id");
  // console.log(type, "type");
  // console.log(workspace_type, "workspace_type");
  const { toast } = useToast();
  const { updateTask, refetchTasks } = useTasks();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const [openModalPassportId, setOpenModalPassportId] = useState<number | null>(
    null
  );

  const [isEditing, setIsEditing] = useState(false);

  const [openModalId, setOpenModalId] = useState<string | null>(null);

  let passportQuery = PASSPORT_COLLECTION_QUERY;

  let queryVariables;

  if (user_id && workspace_id && room_id && recording_id) {
    // console.log("usePassport 5");
    queryVariables = {
      user_id,
      workspace_id,
      room_id,
      recording_id,
      is_owner,
      type,
    };
  }

  if (user_id && is_owner && workspace_id && room_id && !recording_id) {
    // console.log("usePassport 4");
    queryVariables = {
      user_id,
      workspace_id,
      room_id,
      is_owner,
      type,
    };
  }

  if (
    user_id &&
    is_owner &&
    workspace_id &&
    type &&
    task_id &&
    !room_id &&
    !recording_id
  ) {
    // console.log("usePassport 3");
    queryVariables = {
      user_id,
      workspace_id,
      is_owner,
      type,
      task_id,
    };
  }

  if (user_id && is_owner && !workspace_id && !room_id && !recording_id) {
    // console.log("usePassport 2");
    queryVariables = {
      user_id,
      is_owner,
      type,
    };
  }

  if (
    user_id &&
    is_owner &&
    !workspace_id &&
    !room_id &&
    !recording_id &&
    !is_owner
  ) {
    // console.log("usePassport 1");
    queryVariables = {
      user_id,
      type,
    };
  }

  if (!is_owner && type === "room" && workspace_type === "Water") {
    // console.log("usePassport Water");
    passportQuery = PASSPORT_COLLECTION_IS_NOT_OWNER_QUERY;
    queryVariables = {
      user_id,
      is_owner,
      type: "room",
    };
  }

  if (!is_owner && type === "room" && workspace_type === "Fire") {
    // console.log("usePassport Fire");
    passportQuery = PASSPORT_COLLECTION_IS_NOT_OWNER_QUERY;
    queryVariables = {
      workspace_id,
      room_id,
      is_owner,
      type: "room",
    };
  }

  if (!is_owner && type === "task") {
    passportQuery = PASSPORT_COLLECTION_BY_TASK_ID_QUERY;
    // console.log("usePassport task");
    queryVariables = {
      task_id,
    };
  }

  // if (!recording_id && !room_id && !workspace_id && !user_id) {
  //   passportQuery = GET_ALL_PASSPORTS_QUERY;
  // }

  // console.log(queryVariables, "queryVariables");

  const {
    data: passportData,
    loading: passportLoading,
    error: passportError,
    refetch: passportRefetch,
  } = useQuery(passportQuery, {
    variables: queryVariables,
  });

  const passportNode = passportData?.user_passportCollection?.edges;

  const [mutateCreatePassport, { error: mutateCreatePassportError }] =
    useMutation(PASSPORT_CREATE_MUTATION);

  if (mutateCreatePassportError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log("mutateCreatePassportError", mutateCreatePassportError.message);
  }

  const [mutateUpdatePassport, { error: mutateUpdatePassportError }] =
    useMutation(PASSPORT_UPDATE_MUTATION, {
      variables: {
        username,
      },
    });

  if (mutateUpdatePassportError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateUpdatePassportError.message);
  }

  const [mutateDeletePassport, { error: mutateDeletePassportError }] =
    useMutation(PASSPORT_DELETE_MUTATION);

  if (mutateDeletePassportError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateDeletePassportError.message);
  }

  const onCreatePassport = async () => {
    try {
      const formData = getValues();
      if (username === formData.username) {
        toast({
          title: "Passport already exists",
          variant: "destructive",
        });
        reset({
          title: "",
          description: "",
          label: "",
        });
        return;
      }

      const { isUserExist, user } = await checkUsernameAndReturnUser(
        formData.username
      );

      const checkIfPassportExists =
        (passportNode &&
          passportNode.some((passport: any) => {
            return passport.node.username === formData.username;
          })) ||
        false;

      if (checkIfPassportExists) {
        toast({
          title: "Passport already exists",
          variant: "destructive",
        });
        reset({
          title: "",
          description: "",
          label: "",
        });
        return;
      }
      const variables = {
        objects: {
          user_id: user.user_id,
          workspace_id: formData.workspace_id,
          room_id: formData.room_id,
          recording_id: formData.recording_id || "",
          photo_url: user.photo_url,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          chat_id: String(user.telegram_id),
          task_id,
          is_owner: false,
          type,
        },
      };
      console.log(variables, "variables:::");

      // const assignedArray: PassportNode[] = [
      //   {
      //     user_id: user.user_id,
      //     username: user.username,
      //     photo_url: user.photo_url,
      //   },
      // ];
      // console.log(assignedArray, "assignedArray");

      // assigned_to && assignedArray.push(...assigned_to);

      if (isUserExist) {
        await mutateCreatePassport({
          variables,
          onCompleted: () => {
            toast({
              title: "Passport created",
              description: "Passport created successfully",
            });
            // create assigned_to
            // task_id && assignedArray && updateTask(task_id, assignedArray);
            passportRefetch();
            refetchTasks();
            reset({
              title: "",
              description: "",
              label: "",
            });
          },
        });
      } else {
        toast({
          title: "Member not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      captureExceptionSentry("Error creating passport", "usePassport");
      toast({
        title: "Error creating passport",
        variant: "destructive",
      });
    }
  };

  const createPassport = async (
    workspace_id: string,
    room_id: string,
    is_owner: boolean
  ) => {
    console.log("createPassport");
    try {
      const { isUserExist, user } = await checkUsernameAndReturnUser(username);
      const variables = {
        objects: {
          user_id: user.user_id,
          workspace_id,
          room_id,
          recording_id: recording_id || "",
          photo_url: user.photo_url,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          chat_id: String(user.telegram_id),
          is_owner,
          type: "room",
        },
      };
      console.log(variables, "variables");
      if (isUserExist) {
        await mutateCreatePassport({
          variables,
          onCompleted: () => {
            passportRefetch();
          },
        });
      } else {
        toast({
          title: "Member not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating passport", JSON.stringify(error));
      captureExceptionSentry("Error creating passport", "usePassport");
      toast({
        title: "Error creating passport",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error)}</code>
          </pre>
        ),
      });
    }
  };

  const onUpdatePassport = () => {
    const formData = getValues();

    const variables = {
      id: openModalId,
      title: formData.title,
      description: formData.description,
      updated_at: new Date().toISOString(),
    };

    mutateUpdatePassport({
      variables,
      onCompleted: () => {
        passportRefetch();
      },
    });
  };

  const onDeletePassportTask = (passport_id: number, user_id: string) => {
    // const newAssignee =
    //   assigned_to && assigned_to.filter((item) => item.user_id !== user_id);

    mutateDeletePassport({
      variables: {
        passport_id: Number(passport_id),
      },

      onCompleted: () => {
        passportRefetch();
        refetchTasks();
        // delete assigned_to
        // task_id && updateTask(task_id, newAssignee);
      },
    });
    closeModal();
  };

  const onDeletePassportRoom = (task_id: number) => {
    mutateDeletePassport({
      variables: {
        passport_id: Number(task_id),
      },
      onCompleted: () => {
        passportRefetch();
        refetchTasks();
      },
    });
    closeModal();
  };

  const closeModal = useCallback(() => {
    setOpenModalId(null);
    onClose();
  }, [onClose]);

  const onOpenModalPassport = () => {
    onOpen();
  };

  return {
    passportData: passportNode,
    passportLoading,
    passportError,
    passportRefetch,
    isOpenModalPassport: isOpen,
    onOpenModalPassport,
    onOpenChangeModalPassport: onOpenChange,
    onCreatePassport,
    createPassport,
    onDeletePassportTask,
    onDeletePassportRoom,
    onUpdatePassport,
    setValuePassport: setValue,
    controlPassport: control,
    handleSubmitPassport: handleSubmit,
    getValuesPassport: getValues,
    openModalPassportId,
    setOpenModalPassportId,
    isEditingPassport: isEditing,
    setIsEditingPassport: setIsEditing,
  };
};

type UsePassportReturn = {
  passportData: Passport[];
  passportLoading: boolean;
  passportError: any;
  passportRefetch: () => void;
  isOpenModalPassport: boolean;
  onOpenModalPassport: () => void;
  onOpenChangeModalPassport: () => void;
  onDeletePassportTask: (passport_id: number, user_id: string) => void;
  onDeletePassportRoom: (id: number) => void;
  onCreatePassport: () => void;
  createPassport: (
    workspace_id: string,
    room_id: string,
    is_owner: boolean
  ) => void;
  onUpdatePassport: () => void;
  setValuePassport: (id: string, value: any) => void;
  controlPassport: any;
  handleSubmitPassport: any;
  getValuesPassport: any;
  openModalPassportId: number | null;
  setOpenModalPassportId: (id: number | null) => void;
  isEditingPassport: boolean;
  setIsEditingPassport: (isEditing: boolean) => void;
};

export { usePassport };

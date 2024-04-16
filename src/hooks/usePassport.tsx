import { useToast } from "@/components/ui/use-toast";
import {
  GET_ALL_PASSPORTS_QUERY,
  GET_ROOM_PASSPORTS_QUERY,
  GET_USER_PASSPORTS_QUERY,
  GET_WORKSPACE_PASSPORTS_QUERY,
  PASSPORT_COLLECTION_QUERY,
  PASSPORT_CREATE_MUTATION,
  PASSPORT_DELETE_MUTATION,
  PASSPORT_UPDATE_MUTATION,
} from "@/graphql/query";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useDisclosure } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "./useUser";
import { PassportArray } from "@/types";
import { checkUsername, checkUsernameAndReturnUser } from "./useSupabase";
import { useWorkspace } from "./useWorkspace";

type passportType = {
  room_id: string;
  workspace_id: string;
  recording_id?: string;
  user_id?: string;
};

const usePassport = ({
  room_id,
  workspace_id,
  recording_id,
  user_id,
}: passportType): UsePassportReturn => {
  const { username } = useUser();
  const { toast } = useToast();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { control, handleSubmit, getValues, setValue, reset } = useForm();

  const [openModalPassportId, setOpenModalPassportId] = useState<number | null>(
    null
  );

  const [isEditing, setIsEditing] = useState(false);

  const [openModalId, setOpenModalId] = useState<string | null>(null);

  let passportQuery = PASSPORT_COLLECTION_QUERY;

  let queryVariables;

  if (recording_id && room_id && workspace_id && user_id) {
    passportQuery = PASSPORT_COLLECTION_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
      recording_id,
    };
  }

  if (!recording_id) {
    passportQuery = GET_ROOM_PASSPORTS_QUERY;
    queryVariables = {
      user_id,
      room_id,
      workspace_id,
    };
  }

  if (!room_id && !recording_id) {
    passportQuery = GET_WORKSPACE_PASSPORTS_QUERY;
    queryVariables = {
      user_id,
      workspace_id,
    };
  }

  if (!recording_id && !room_id && !workspace_id) {
    passportQuery = GET_USER_PASSPORTS_QUERY;
    queryVariables = {
      user_id,
    };
  }

  // if (!recording_id && !room_id && !workspace_id && !user_id) {
  //   passportQuery = GET_ALL_PASSPORTS_QUERY;
  // }

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
    useMutation(PASSPORT_DELETE_MUTATION, {
      variables: {
        username,
      },
    });

  if (mutateDeletePassportError instanceof ApolloError) {
    // Обработка ошибки ApolloError
    console.log(mutateDeletePassportError.message);
  }

  const onCreatePassport = async () => {
    try {
      const formData = getValues();
      const { isUserExist, user } = await checkUsernameAndReturnUser(
        formData.username
      );

      if (isUserExist) {
        const mutateCreatePassportResult = await mutateCreatePassport({
          variables: {
            objects: {
              user_id: user.user_id,
              workspace_id: formData.workspace_id,
              room_id: formData.room_id,
              recording_id: formData.recording_id,
              photo_url: user.photo_url,
              username: user.username,
            },
          },
          onCompleted: () => {
            toast({
              title: "Passport created",
              description: "Passport created successfully",
            });
            passportRefetch();
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
      console.log(error, "error");
      toast({
        title: "Error creating passport",
        variant: "destructive",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(mutateCreatePassportError, null, 2)}
            </code>
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

  const onDeletePassport = (id: number) => {
    mutateDeletePassport({
      variables: {
        filter: {
          id: {
            eq: Number(id),
          },
        },
      },
      onCompleted: () => {
        passportRefetch();
      },
    });
    closeModal();
  };

  const closeModal = useCallback(() => {
    setOpenModalId(null);
    onClose();
  }, [onClose]);

  return {
    passportData: passportNode,
    passportLoading,
    passportError,
    passportRefetch,
    isOpenModalPassport: isOpen,
    onOpenModalPassport: onOpen,
    onOpenChangeModalPassport: onOpenChange,
    onCreatePassport,
    onDeletePassport,
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
  passportData: PassportArray;
  passportLoading: boolean;
  passportError: any;
  passportRefetch: () => void;
  isOpenModalPassport: boolean;
  onOpenModalPassport: () => void;
  onOpenChangeModalPassport: () => void;
  onCreatePassport: () => void;
  onUpdatePassport: () => void;
  onDeletePassport: (id: number) => void;
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

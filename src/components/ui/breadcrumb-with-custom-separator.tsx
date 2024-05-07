import { Slash } from "lucide-react";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { setLoading } from "@/apollo/reactive-store";
import { useUser } from "@/hooks/useUser";

export function BreadcrumbWithCustomSeparator({
  username,
  workspace_id,
  room_id,
  record_id,
  room_name,
}: {
  username: string;
  workspace_id?: string;
  room_id?: string;
  room_name?: string;
  record_id?: string;
}) {
  const router = useRouter();

  const { user_id, workspace_name, recording_name } = useUser();

  const goToHome = () => {
    router.push(`/${username}/${user_id}`);
    setLoading(true);
  };

  const goToWorkspaces = () => {
    router.push(`/${username}/${user_id}/${workspace_id}`);
    setLoading(true);
  };

  const goToRooms = () => {
    router.push(`/${username}/${user_id}/${workspace_id}/${room_id}`);
    setLoading(true);
  };

  const goToRecords = () => {
    router.push(
      `/${username}/${user_id}/${workspace_id}/${room_id}/${record_id}`
    );
    setLoading(true);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {username && (
          <BreadcrumbItem>
            <BreadcrumbLink onClick={goToHome}>Home</BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {workspace_id && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={goToWorkspaces}>
                {workspace_name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {room_name && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage onClick={goToRooms}>{room_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {record_id && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage onClick={goToRecords}>
                {recording_name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

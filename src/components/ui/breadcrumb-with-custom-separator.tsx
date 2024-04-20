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

export function BreadcrumbWithCustomSeparator({
  username,
  workspace_id,
  room_id,
  record_id,
}: {
  username: string;
  workspace_id?: string;
  room_id?: string;
  record_id?: string;
}) {
  const router = useRouter();

  const goToHome = () => {
    router.push(`/${username}`);
    setLoading(true);
  };

  const goToWorkspaces = () => {
    router.push(`/${username}/${workspace_id}`);
    setLoading(true);
  };

  const goToRooms = () => {
    router.push(`/${username}/${workspace_id}/${room_id}`);
    setLoading(true);
  };

  const goToRecords = () => {
    router.push(`/${username}/${workspace_id}/${room_id}/${record_id}`);
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
                Workspaces
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {room_id && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage onClick={goToRooms}>Room</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {record_id && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage onClick={goToRecords}>Record</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

import { useCurrentUserStore } from "../authDataStore";
import { useGlobalUserPermissionsStore } from "../globalUserPermissions/globalUserPermissionsStore";
import { GenericRouteProtectorTemplate } from "./GenericRouteProtectorTemplate";

export const AdminUserOnlyRouteTemplate = (p: {
  children: React.ReactNode;
  LoadingComponent?: React.ReactNode;
  NotAdminComponent?: React.ReactNode;
  onIsLoading?: () => void;
  onIsSuccess?: () => void;
  onIsFailure?: () => void;
}) => {
  const currentUserStore = useCurrentUserStore();
  const globalUserPermissionsStore = useGlobalUserPermissionsStore();

  const isAdmin =
    currentUserStore.data.authStatus === "loggedIn" &&
    globalUserPermissionsStore.data?.role === "admin";

  return (
    <GenericRouteProtectorTemplate
      children={p.children}
      loadingCondition={() =>
        currentUserStore.data.authStatus === "loading" ||
        globalUserPermissionsStore.data === undefined
      }
      condition={() => isAdmin}
      ConditionLoadingComponent={p.LoadingComponent}
      ConditionSuccessComponent={p.children}
      ConditionFailureComponent={p.NotAdminComponent}
      onConditionLoading={p.onIsLoading}
      onConditionSuccess={p.onIsSuccess}
      onConditionFailure={p.onIsFailure}
    />
  );
};

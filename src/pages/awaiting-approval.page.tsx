import { NotApprovedUserOnlyRouteProtector } from "@/modules/routeProtector/NotApprovedUserOnlyRouteProtector";
import { AwaitingApprovalScreen } from "@/screens/AwaitingApprovalScreen";

const AwaitingApprovalPage = () => {
  return (
    <NotApprovedUserOnlyRouteProtector>
      <AwaitingApprovalScreen />
    </NotApprovedUserOnlyRouteProtector>
  );
};

export default AwaitingApprovalPage;

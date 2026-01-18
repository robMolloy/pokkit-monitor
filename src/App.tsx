import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { LayoutTemplate } from "./components/templates/LayoutTemplate";
import { Header } from "./modules/Header";
import { useThemeStore } from "./modules/themeToggle/themeStore";
import { LeftSidebar } from "./modules/LeftSidebar";
import { useUsersStore } from "./modules/auth/users/usersStore";
import { useCurrentUserStore } from "./modules/auth/authDataStore";
import { useInitAuth } from "./modules/auth/useInitAuth";
import { pb } from "./config/pocketbaseConfig";
import { smartSubscribeToUsers } from "./modules/auth/users/dbUsersUtils";
import { subscribeToUserGlobalUserPermissions } from "./modules/auth/globalUserPermissions/dbGlobalUserPermissions";
import { useGlobalUserPermissionsStore } from "./modules/auth/globalUserPermissions/globalUserPermissionsStore";

function App() {
  return useRoutes(routes);
}

function AppWrapper() {
  const themeStore = useThemeStore();
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();
  const globalUserPermissionsStore = useGlobalUserPermissionsStore();
  themeStore.useThemeStoreSideEffect();

  useInitAuth({
    pb: pb,
    onIsLoading: () => {},
    onIsLoggedIn: (user) => {
      smartSubscribeToUsers({ pb, onChange: (x) => usersStore.setData(x) });
      subscribeToUserGlobalUserPermissions({
        pb,
        id: user.id,
        onChange: (x) => globalUserPermissionsStore.setData(x),
      });
    },
    onIsLoggedOut: () => {},
  });

  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_URL}>
      <LayoutTemplate
        Header={<Header />}
        LeftSidebar={currentUserStore.data.authStatus === "loggedIn" && <LeftSidebar />}
      >
        <App />
      </LayoutTemplate>
    </BrowserRouter>
  );
}

export default AppWrapper;

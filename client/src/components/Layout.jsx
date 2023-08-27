import Header from "./Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <main>
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

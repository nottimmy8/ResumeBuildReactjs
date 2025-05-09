import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
type DashProps = {
  activeMenu?: () => void;
  children: React.ReactNode;
};
const DashboardLayout = ({ activeMenu, children }: DashProps) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && <div className="container mx-auto pt-4 pb-4">{children}</div>}
    </div>
  );
};

export default DashboardLayout;

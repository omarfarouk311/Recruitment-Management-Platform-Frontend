import { CompanyProfileInfo } from "../components/Profile/sections/CompanyProfileInfo";
import UserNav from "../components/Header/UserNav";

export default function () {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <div className="p-6">
        <CompanyProfileInfo />
      </div>
    </div>
  );
}

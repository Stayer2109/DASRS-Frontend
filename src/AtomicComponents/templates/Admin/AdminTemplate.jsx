/** @format */

import { useState } from "react";
import { AdminContent } from "@/AtomicComponents/organisms/AdminContent/AdminContent";
import { AdminHeader } from "@/AtomicComponents/molecules/AdminHeader/AdminHeader";
import { Sidebar } from "@/AtomicComponents/organisms/Sidebar/Sidebar";

const AdminTemplate = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <AdminHeader activeTab={activeTab} />
        <AdminContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default AdminTemplate;


import React from "react";
import { UserManagement } from "./UserManagement";
import { SystemStatus } from "./SystemStatus";
import { QuickActions } from "./QuickActions";

export const AdminPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UserManagement />
      <SystemStatus />
      <QuickActions />
    </div>
  );
};

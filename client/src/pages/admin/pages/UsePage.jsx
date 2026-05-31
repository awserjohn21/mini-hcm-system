import { DataTable } from "@/components/DataTable";
import api from "@/lib/axios";
import { useState, useEffect } from "react";

import NavigationMenu from "@/components/navigation";
import LogoutButton from "@/components/logout";

import { adminUserColumns } from "../components/userColumns";
import EditUserDialog from "../components/editUserDialog";

export default function UserAdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Attach edit handler to table rows
  const columns = adminUserColumns({
    onEdit: (data) => {
      setSelectedUser(data);
      setOpenEdit(true);
    },
  });

  const updateUserState = (updatedUser) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)),
    );
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/users/all");

        setUsers(response.data);

        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-lg text-muted-foreground">Admin </div>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">All Users</div>

            <NavigationMenu activePage="users" isAdmin={true} />
          </div>

          <LogoutButton />
        </div>

        {/* TABLE */}
        <DataTable columns={columns} data={users} />

        {/* EDIT DIALOG */}
        <EditUserDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          data={selectedUser}
          onUpdated={updateUserState}
        />
      </div>
    </div>
  );
}

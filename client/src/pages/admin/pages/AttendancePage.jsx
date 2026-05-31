import { DataTable } from "@/components/DataTable";
import api from "@/lib/axios";
import { useState, useEffect } from "react";
import { adminAttendanceColumns } from "../components/attendanceColumn";

import NavigationMenu from "@/components/navigation";
import EditAttendanceDialog from "../components/editAttendanceDialog";
import LogoutButton from "@/components/logout";

export default function AttendanceAdminPage() {
  const [attendance, setAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Map handle to each attendance
  const columns = adminAttendanceColumns({
    onEdit: (data) => {
      setSelectedAttendance(data);
      setOpenEdit(true);
    },
  });

  const updateAttendanceState = (updatedAttendance) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.id === updatedAttendance.id ? updatedAttendance : item,
      ),
    );
  };

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await api.get(`/attendance/all`);
        setAttendance(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadAttendance();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-lg text-muted-foreground">Admin </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              All Attendance Records
            </div>

            <NavigationMenu activePage="attendance" isAdmin={true} />
          </div>
          <LogoutButton />
        </div>

        {/* TABLE */}
        <DataTable columns={columns} data={attendance} />

        {/* EDIT DIALOG */}
        <EditAttendanceDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          data={selectedAttendance}
          onUpdated={updateAttendanceState}
        />
      </div>
    </div>
  );
}

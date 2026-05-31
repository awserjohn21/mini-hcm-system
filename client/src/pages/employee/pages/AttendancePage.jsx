import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useState, useEffect } from "react";
import { userAttendanceColumns } from "../components/attendanceColumns";
import { toast } from "sonner";
import NavigationMenu from "@/components/navigation";
import LogoutButton from "@/components/logout";
import ConfirmPunchDialog from "../components/confirmPunchDialog";
export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (confirmAction === "in") await punchIn();
      if (confirmAction === "out") await punchOut();

      setConfirmAction(null);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await api.get(`/attendance`);
        const data = response.data;
        setUser(data.user);
        const mergedData = data.attendance.map((a) => ({
          ...a,
          name: data.user.name,
          email: data.user.email,
          timezone: data.user.timezone,
        }));

        setAttendance(mergedData);

        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAttendance();
  }, []);

  // Handle Punch In Logic
  const punchIn = async () => {
    try {
      const response = await api.post("/attendance/time-in");
      const newRecord = response.data.record;

      setAttendance((prev) => [newRecord, ...prev]);
      toast.success("Timed in successfully");
      console.log(newRecord);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
      console.error(error);
    }
  };

  // Handle Punch Out Logic
  const punchOut = async () => {
    try {
      const response = await api.post(`/attendance/time-out`);
      const updatedRecord = response.data.record;

      setAttendance((prev) =>
        prev.map((attendance) =>
          attendance.id === updatedRecord.id ? updatedRecord : attendance,
        ),
      );

      toast.success("Timed out successfully");
      console.log(updatedRecord);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-lg text-muted-foreground">
          Employee,{" "}
          <span className="text-teal-600 font-semibold">{user?.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Attendance Records
            </div>
            <NavigationMenu activePage="attendance" isAdmin={false} />
          </div>

          <LogoutButton />
        </div>

        <DataTable columns={userAttendanceColumns} data={attendance}>
          <Button
            onClick={() => setConfirmAction("in")}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Punch In
          </Button>

          <Button onClick={() => setConfirmAction("out")} variant="outline">
            Punch Out
          </Button>
        </DataTable>
      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmPunchDialog
        open={!!confirmAction}
        type={confirmAction}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}

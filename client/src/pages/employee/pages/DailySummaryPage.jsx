import { DataTable } from "@/components/dataTable";
import { dailySummaryColumns } from "../components/dailySummaryColumns";
import { useEffect, useState } from "react";
import NavigationMenu from "@/components/navigation";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes } from "@/lib/formatTime";
import LogoutButton from "@/components/logout";
export default function DailySummaryPage() {
  const [dailySummary, setDailySummary] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  useEffect(() => {
    const loadDailySummary = async () => {
      try {
        const response = await api.get(`/dailySummary`);

        setDailySummary(response.data.data);
        setSelectedSummary(response.data.data[0] || null);
        setUserStats(response.data.userStats);
        setUser(response.data.name);
      } catch (err) {
        console.error(err);
      }
    };

    loadDailySummary();
  }, []);

  const handleRowSelect = async (rowData) => {
    try {
      setSelectedSummary(rowData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-lg text-muted-foreground">
          Employee, <span className="text-teal-600 font-semibold">{user}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Summary Records</div>
            <NavigationMenu activePage="dailySummary" isAdmin={false} />
          </div>
          <LogoutButton />
        </div>
        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[300px] mt-6">
          {/* DAILY SUMMARY CARD */}
          <Card className="row-span-3">
            <CardHeader className="p-3">
              <CardTitle className="text-sm text-teal-600">
                Daily Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="p-3 text-sm space-y-3">
              <div>
                <span className="text-teal-600/70">Regular Hours:</span>{" "}
                <span className="text-black">
                  {formatMinutes(selectedSummary?.regularHours || 0)}
                </span>
              </div>

              <div>
                <span className="text-teal-600/70">Overtime:</span>{" "}
                <span className="text-black">
                  {formatMinutes(selectedSummary?.overtime || 0)}
                </span>
              </div>

              <div>
                <span className="text-teal-600/70">Night Differential:</span>{" "}
                <span className="text-black">
                  {formatMinutes(selectedSummary?.nightDifferential || 0)}
                </span>
              </div>

              <div>
                <span className="text-teal-600/70">Late:</span>{" "}
                <span className="text-black">
                  {formatMinutes(selectedSummary?.late || 0)}
                </span>
              </div>

              <div>
                <span className="text-teal-600/70">Undertime:</span>{" "}
                <span className="text-black">
                  {formatMinutes(selectedSummary?.undertime || 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Worked Hours */}
          <Card className="col-span-2 flex flex-col justify-center">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm text-teal-600">
                Total Regular Hours
              </CardTitle>
            </CardHeader>

            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold leading-none">
                {formatMinutes(userStats?.totalRegular || 0)}
              </p>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-teal-600">Night Differential</p>
              <p className="text-xl font-bold">
                {formatMinutes(userStats?.totalND || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-teal-600">Overtime</p>
              <p className="text-xl font-bold">
                {formatMinutes(userStats?.totalOT || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-teal-600">Late</p>
              <p className="text-xl font-bold">
                {formatMinutes(userStats?.totalLate || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-teal-600">Undertime</p>
              <p className="text-xl font-bold">
                {formatMinutes(userStats?.totalUT || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* TABLE */}
        <div className="mt-6">
          <DataTable
            columns={dailySummaryColumns}
            data={dailySummary}
            onRowSelect={handleRowSelect}
          />
        </div>
      </div>
    </div>
  );
}

import { DataTable } from "@/components/dataTable";
import { dailySummaryColumns } from "../components/dailySummaryColumns";
import { useEffect, useState } from "react";
import NavigationMenu from "@/components/navigation";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatMinutes } from "@/lib/formatTime";
import LogoutButton from "@/components/logout";
export default function DailySummaryPage() {
  const [dailySummary, setDailySummary] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  useEffect(() => {
    const loadDailySummary = async () => {
      try {
        const response = await api.get(`/dailySummary/all`);
        setDailySummary(response.data.data);
        setSelectedSummary(response.data.data[0] || null);
        setUserStats(response.data.userStats);
      } catch (err) {
        console.error(err);
      }
    };

    loadDailySummary();
  }, []);

  const handleRowSelect = async (rowData) => {
    try {
      console.log(rowData);
      setSelectedSummary(rowData);
      const response = await api.get(`/weeklySummary/${rowData.userId}`, {
        params: {
          date: new Date(rowData.date._seconds * 1000),
        },
      });
      console.log(response.data);
      setWeeklySummary(response.data.summary);
      setUserStats(response.data.userStats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-lg text-muted-foreground">Admin </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              All Summary Records
            </div>

            <NavigationMenu activePage="dailySummary" isAdmin={true} />
          </div>
          <LogoutButton />
        </div>
        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[300px] mt-6">
          {/* DAILY SUMMARY CARD */}
          <Card className="row-span-3">
            <CardContent className="p-3 text-sm overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* DAILY SUMMARY */}
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(selectedSummary?.date) || "Date"}
                  </div>
                  <h3 className="font-medium text-teal-600">Daily Summary</h3>

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
                    <span className="text-teal-600/70">
                      Night Differential:
                    </span>{" "}
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
                </div>

                {/* WEEKLY SUMMARY */}
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(weeklySummary?.startDate) || "Date Start"}, {""}
                    {formatDate(weeklySummary?.endDate) || "Date End"}
                  </div>
                  <h3 className="font-medium text-blue-600">Weekly Summary</h3>

                  <div>
                    <span className="text-blue-600/70">Regular Hours:</span>{" "}
                    <span className="text-black">
                      {formatMinutes(weeklySummary?.totalRegularHours || 0)}
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-600/70">Overtime:</span>{" "}
                    <span className="text-black">
                      {formatMinutes(weeklySummary?.totalOvertimeHours || 0)}
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-600/70">
                      Night Differential:
                    </span>{" "}
                    <span className="text-black">
                      {formatMinutes(weeklySummary?.totalNightDiffHours || 0)}
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-600/70">Late:</span>{" "}
                    <span className="text-black">
                      {formatMinutes(weeklySummary?.totalLateMinutes || 0)}
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-600/70">Undertime:</span>{" "}
                    <span className="text-black">
                      {formatMinutes(weeklySummary?.totalUndertimeMinutes || 0)}
                    </span>
                  </div>
                </div>
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

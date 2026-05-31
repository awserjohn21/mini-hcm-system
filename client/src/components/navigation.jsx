import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

import { useNavigate } from "react-router-dom";

export default function NavigationMenu({ activePage, isAdmin }) {
  const navigate = useNavigate();

  const attendancePath = isAdmin ? "/attendance/admin" : "/attendance";

  const dailySummaryPath = isAdmin ? "/dailySummary/admin" : "/dailySummary";

  const usersPath = "/users/admin";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => navigate(attendancePath)}
            className={`cursor-pointer ${
              activePage === "attendance"
                ? "text-teal-600 font-medium"
                : "text-muted-foreground hover:text-teal-600"
            }`}
          >
            Attendance
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => navigate(dailySummaryPath)}
            className={`cursor-pointer ${
              activePage === "dailySummary"
                ? "text-teal-600 font-medium"
                : "text-muted-foreground hover:text-teal-600"
            }`}
          >
            Daily Summary
          </BreadcrumbLink>
        </BreadcrumbItem>

        {isAdmin && (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate(usersPath)}
                className={`cursor-pointer ${
                  activePage === "users"
                    ? "text-teal-600 font-medium"
                    : "text-muted-foreground hover:text-teal-600"
                }`}
              >
                Users
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

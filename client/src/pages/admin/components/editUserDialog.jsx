import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";

export default function EditUserDialog({
  open,
  onOpenChange,
  data,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        schedule: {
          start: e.target.start.value,
          end: e.target.end.value,
        },
      };

      const res = await api.put(`/users/${data.id}/schedule`, payload);

      onUpdated?.(res.data.user);

      toast.success("Schedule updated successfully");

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Schedule</DialogTitle>
        </DialogHeader>

        {data && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Employee Name
              </p>

              <p className="font-medium">{data.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Shift Start</p>

              <input
                name="start"
                type="time"
                defaultValue={data.schedule?.start || ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Shift End</p>

              <input
                name="end"
                type="time"
                defaultValue={data.schedule?.end || ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

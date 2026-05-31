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
import { formatDate } from "@/lib/formatTime";
import { toast } from "sonner";
export default function EditAttendanceDialog({
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
        timeIn: new Date(e.target.timeIn.value),
        timeOut: new Date(e.target.timeOut.value),
      };
      const res = await api.put(`/attendance/${data.id}`, payload);
      onUpdated?.(res.data.record);
      console.log(res.data);
      toast.success("Attendance updated successfully");
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
          <DialogTitle>Edit Attendance</DialogTitle>
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
              <p className="text-sm text-muted-foreground">Time In</p>
              <input
                name="timeIn"
                type="datetime-local"
                defaultValue={formatDate(data.timeIn)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Time Out</p>
              <input
                name="timeOut"
                type="datetime-local"
                defaultValue={formatDate(data.timeOut)}
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

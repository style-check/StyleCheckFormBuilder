import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddComponentDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  componentType: string;
}

export const AddComponentDialog: React.FC<AddComponentDialogProps> = ({
  open,
  onClose,
  onAdd,
  componentType,
}) => {
  const [label, setLabel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const componentData = {
      type: componentType,
      label: label.trim(),
      // For buttons, you might want to add variant and buttonType in the future
    };

    onAdd(componentData);
    setLabel("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white shadow-2xl rounded-xl border border-gray-200 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Add {componentType.replace("-", " ").toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="label" className="text-sm font-medium text-gray-700 tracking-wide">
              Label
            </Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter component label"
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 ease-in-out placeholder-gray-400"
            />
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ease-in-out"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 ease-in-out hover:shadow-md transform hover:-translate-y-0.5"
            >
              Add Component
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCategoryApi } from '@/services/api';
import { toast } from 'sonner';

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: string;
  parentId?: string;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ open, onClose, onSuccess, type, parentId = "defaultParentId" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
    visibility: true,
    show_in_menu: true,
    has_active_items: true,
    depth: 1,
    description: '',
    image: null as File | null
  });

  const createNewItem = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('category_name', formData.category_name);
    formDataToSend.append('visibility', '1');
    formDataToSend.append('show_in_menu', String(formData.show_in_menu));
    formDataToSend.append('created_time', new Date().toISOString());
    formDataToSend.append('parent_category_id', parentId);
    formDataToSend.append('has_active_items', String(formData.has_active_items));
    formDataToSend.append('depth', String(formData.depth));
    formDataToSend.append('description', formData.description);
    formDataToSend.append('image', formData.image);

    try {
      const response = await createCategoryApi(formDataToSend);
      return { success: true, data: response.data };
    } catch (error) {
      toast.error('Failed to create category');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const result = await createNewItem();
      if (result.success) {
        toast.success('Category created successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error('Error creating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category_name">Category Name*</Label>
            <Input id="category_name" required value={formData.category_name} onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="image">Image*</Label>
            <Input id="image" type="file" required onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFormData(prev => ({ ...prev, image: file })); } }} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Create Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

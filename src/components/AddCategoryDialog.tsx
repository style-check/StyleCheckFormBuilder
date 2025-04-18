import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCategoryApi } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '@/context/FormContext';
import { CategoryData, EntityType } from '@/types';

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: string;
  parentId?: string;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ open, onClose, onSuccess, type, parentId }) => {
  const navigate = useNavigate();
  const { setCategoryFormData } = useFormContext();

  // Validate parentId
  const isValidParentId = parentId && parentId !== "defaultParentId";
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
    // For first-level categories, parent_category_id should always be null (or "" as per backend)
    if (formData.depth === 1) {
      // No parent validation required
    } else if (!isValidParentId) {
      toast.error('A valid parent category must be selected.');
      return { success: false };
    }
    const formDataToSend = new FormData();
    formDataToSend.append('category_name', formData.category_name);
    formDataToSend.append('visibility', '1');
    formDataToSend.append('show_in_menu', String(formData.show_in_menu));
    formDataToSend.append('created_time', new Date().toISOString());
    formDataToSend.append('parent_category_id', formData.depth === 1 ? '0' : parentId!); // Use '0' for top-level as required
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
        
        // Prepare category data with correct type
        const categoryFormData: CategoryData = {
          name: formData.category_name,
          category_name: formData.category_name, // Add this line
          description: formData.description || '',
          image: formData.image,
          visibility: formData.visibility,
          show_in_menu: formData.show_in_menu,
          created_time: new Date().toISOString(),
          type: 'category'
        };

// Set the data in context and navigate
        setCategoryFormData(categoryFormData);
        onSuccess();
        onClose();
        navigate('/', { 
          state: { entityData: categoryFormData },
          replace: true 
        });
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

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="visibility">Visibility</Label>
            <Switch
              id="visibility"
              checked={formData.visibility}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visibility: checked }))}
            />
          </div>

          {/* Show in Menu Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show_in_menu">Show in Menu</Label>
            <Switch
              id="show_in_menu"
              checked={formData.show_in_menu}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_in_menu: checked }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || (formData.depth > 1 && !isValidParentId)}>Create Category</Button>
          </DialogFooter>
          {formData.depth > 1 && !isValidParentId && (
            <div className="text-red-500 text-xs mt-2">A valid parent category must be selected.</div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

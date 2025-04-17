import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createSubcategoryApi } from '@/services/api';
import { toast } from 'sonner';

interface AddSubcategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: string;
    parentId?: string;  // Ensure category_id (parentId) is passed
}

export const AddSubcategoryDialog: React.FC<AddSubcategoryDialogProps> = ({
    open,
    onClose,
    onSuccess,
    type,
    parentId
}) => {
    // Validate parentId
    const isValidParentId = parentId && parentId !== "defaultParentId";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subcategory_name: '',
        visibility: true,
        show_in_menu: true,
        has_active_items: true,
        depth: 2, // Subcategories at depth 2
        description: '',
        image: null as File | null,
        category_id: parentId, // Use parentId as the category_id for subcategory
    });

    const createNewItem = async () => {
        if (!isValidParentId) {
            toast.error('A valid parent category must be selected.');
            return { success: false };
        }
        const formDataToSend = new FormData();
        formDataToSend.append('sub_category_name', formData.subcategory_name);
        formDataToSend.append('visibility', formData.visibility ? '1' : '0');
        formDataToSend.append('show_in_menu', String(formData.show_in_menu));
        formDataToSend.append('created_time', new Date().toISOString());
        formDataToSend.append('category_id', parentId!); // Use parentId directly
        formDataToSend.append('has_active_items', String(formData.has_active_items));
        formDataToSend.append('depth', String(formData.depth));
        formDataToSend.append('description', formData.description);
        if (formData.image) {
            formDataToSend.append('image', formData.image); // Append image if selected
        }

        try {
            const response = await createSubcategoryApi(formDataToSend);
            return { success: true, data: response.data };
        } catch (error) {
            toast.error('Failed to create subcategory');
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const result = await createNewItem();
            if (result.success) {
                toast.success('Subcategory created successfully');
                onSuccess(); // Trigger success callback
                onClose(); // Close the dialog
            }
        } catch (error) {
            toast.error('Error creating subcategory');
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Subcategory</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="subcategory_name">Subcategory Name*</Label>
                        <Input
                            id="subcategory_name"
                            required
                            value={formData.subcategory_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, subcategory_name: e.target.value }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Image*</Label>
                        <Input
                            id="image"
                            type="file"
                            required
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, image: file }));
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Switch
                            id="visibility"
                            checked={formData.visibility}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visibility: checked }))}
                        />
                    </div>

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
                        <Button type="submit" disabled={isSubmitting || !isValidParentId}>Create Subcategory</Button>
                    </DialogFooter>
                    {!isValidParentId && (
                        <div className="text-red-500 text-xs mt-2">A valid parent category must be selected.</div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

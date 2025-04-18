// AddSubcategoryTypeDialog.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createSubcategoryTypeApi } from '@/services/api';  // Ensure the import is correct
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '@/context/FormContext';
import { EntityData, EntityType } from '@/types';

interface AddSubcategoryTypeDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: string;
    parentId?: string;  // This will be subcategory_id
}

export const AddSubcategoryTypeDialog: React.FC<AddSubcategoryTypeDialogProps> = ({
    open,
    onClose,
    onSuccess,
    type,
    parentId
}) => {
    const navigate = useNavigate();
    const { setEntityFormData } = useFormContext();

    // Validate parentId
    const isValidParentId = parentId && parentId !== "defaultParentId";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subcategory_type_name: '',
        visibility: true,
        has_active_items: true,
        depth: 3,
        description: '',
        image: null as File | null,
        show_in_menu: true, // Added field for showing in menu
        sub_category_id: parentId, // Use the parentId as subcategory_id
    });

    const createNewItem = async () => {
        if (!isValidParentId) {
            toast.error('A valid parent subcategory must be selected.');
            return { success: false };
        }
        const formDataToSend = new FormData();
        formDataToSend.append('sub_category_type_name', formData.subcategory_type_name);
        formDataToSend.append('visibility', formData.visibility ? '1' : '0');
        formDataToSend.append('created_time', new Date().toISOString());
        formDataToSend.append('sub_category_id', parentId!); // Link to subcategory
        formDataToSend.append('description', formData.description);
        formDataToSend.append('depth', String(formData.depth));
        formDataToSend.append('has_active_items', String(formData.has_active_items));
        formDataToSend.append('show_in_menu', formData.show_in_menu ? '1' : '0'); // Add show_in_menu field
        if (formData.image) {
            formDataToSend.append('image', formData.image); // Append image if selected
        }

        try {
            const response = await createSubcategoryTypeApi(formDataToSend);
            return { success: true, data: response.data };
        } catch (error) {
            toast.error('Failed to create subcategory type');
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const result = await createNewItem();
            if (result.success) {
                const entityData: EntityData = {
                    name: formData.subcategory_type_name,
                    description: formData.description || '',
                    image: formData.image,
                    visibility: formData.visibility,
                    show_in_menu: formData.show_in_menu,
                    created_time: new Date().toISOString(),
                    type: 'subcategoryType' as EntityType,
                    parent_id: parentId || undefined
                };

                setEntityFormData(entityData);
                onSuccess();
                onClose();
                navigate('/', { 
                    state: { 
                        entityData,
                        replace: true 
                    }
                });
            }
        } catch (error) {
            toast.error('Error creating subcategory type');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Subcategory Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="subcategory_type_name">Subcategory Type Name*</Label>
                        <Input
                            id="subcategory_type_name"
                            required
                            value={formData.subcategory_type_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, subcategory_type_name: e.target.value }))} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
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
                            }} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Switch
                            id="visibility"
                            checked={formData.visibility}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visibility: checked }))} />
                    </div>

                    {/* Show in Menu Switch */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show_in_menu">Show in Menu</Label>
                        <Switch
                            id="show_in_menu"
                            checked={formData.show_in_menu}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_in_menu: checked }))} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting || !isValidParentId}>Create Subcategory Type</Button>
                    </DialogFooter>
                    {!isValidParentId && (
                        <div className="text-red-500 text-xs mt-2">A valid parent subcategory must be selected.</div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createProductStyleApi } from '@/services/api';  // Ensure the import is correct
import { toast } from 'sonner';

interface AddProductStyleDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: string;
    productTypeId?: string;  // This will be product_type_id passed from parent
}

export const AddProductStyleDialog: React.FC<AddProductStyleDialogProps> = ({
    open,
    onClose,
    onSuccess,
    type,
    productTypeId = "defaultProductTypeId", // Default to a dummy value if not passed
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        product_style_name: '',
        visibility: true,
        has_active_items: true,
        description: '',
        image: null as File | null,
        show_in_menu: true, // Added field for showing in menu
        product_type_id: productTypeId, // Use the parentId as product_type_id
    });

    const createNewItem = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('product_style_name', formData.product_style_name);
        formDataToSend.append('visibility', formData.visibility ? '1' : '0');
        formDataToSend.append('created_time', new Date().toISOString());
        formDataToSend.append('product_type_id', formData.product_type_id); // Link to product type
        formDataToSend.append('description', formData.description);
        formDataToSend.append('has_active_items', String(formData.has_active_items));
        formDataToSend.append('show_in_menu', formData.show_in_menu ? '1' : '0'); // Add show_in_menu field
        if (formData.image) {
            formDataToSend.append('image', formData.image); // Append image if selected
        }

        try {
            const response = await createProductStyleApi(formDataToSend);
            return { success: true, data: response.data };
        } catch (error) {
            toast.error('Failed to create product style');
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const result = await createNewItem();
            if (result.success) {
                toast.success('Product Style created successfully');
                onSuccess(); // Trigger success callback
                onClose(); // Close the dialog
            }
        } catch (error) {
            toast.error('Error creating product style');
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Product Style</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="product_style_name">Product Style Name*</Label>
                        <Input
                            id="product_style_name"
                            required
                            value={formData.product_style_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, product_style_name: e.target.value }))} />
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
                        <Button type="submit" disabled={isSubmitting}>Create Product Style</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

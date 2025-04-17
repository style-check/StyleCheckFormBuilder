import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchCategories, Category as CategoryType, fetchSubcategories, Subcategory, fetchSubcategoryTypes, SubcategoryType, fetchProductTypes, ProductType, fetchProductStyles, ProductStyle } from '@/services/api';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { AddSubcategoryDialog } from '@/components/AddSubcategoryDialog';
import { AddSubcategoryTypeDialog } from '@/components/AddSubcategoryTypeDialog'; // New Dialog
import { AddProductTypeDialog } from '@/components/AddProductTypeDialog';  // New Dialog for Product Type
import { AddProductStyleDialog } from '@/components/AddProductStyleDialog';
import { useFormContext } from '@/context/FormContext';

export const Category = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subcategoryTypes, setSubcategoryTypes] = useState<SubcategoryType[]>([]); // State for subcategory types
  const [productTypes, setProductTypes] = useState<ProductType[]>([]); // State for product types
  const [productStyles, setProductStyles] = useState<ProductStyle[]>([]);
  const [selectedValues, setSelectedValues] = useState({
    category: '',
    subcategory: '',
    subcategoryType: '',
    productType: '', // Selected product type
    productStyle: '',
  });

  // Dialog states
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showProductStyleDialog, setShowProductStyleDialog] = useState(false); // For Product Style dialog
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [showSubcategoryTypeDialog, setShowSubcategoryTypeDialog] = useState(false); // For Subcategory Type dialog
  const [showProductTypeDialog, setShowProductTypeDialog] = useState(false); // For Product Type dialog

  // ID states for passing to dialogs
  const [subcategoryIdForType, setSubcategoryIdForType] = useState<string | null>(null); // To pass subcategory_id
  const [productTypeId, setProductTypeId] = useState<string | null>(null); // To pass product_type_id
  const [productStyleId, setProductStyleId] = useState<string | null>(null);
  const { setComponents } = useFormContext();
  const navigate = useNavigate();

  // Load categories once on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load subcategories when category is selected
  useEffect(() => {
    if (selectedValues.category) {
      loadSubcategories(selectedValues.category);
    }
  }, [selectedValues.category]);

  // Load subcategory types when subcategory is selected
  useEffect(() => {
    if (selectedValues.subcategory) {
      loadSubcategoryTypes(selectedValues.subcategory);
    }
  }, [selectedValues.subcategory]);

  // Load product types when subcategory type is selected
  useEffect(() => {
    if (selectedValues.subcategoryType) {
      loadProductTypes(selectedValues.subcategoryType);
    }
  }, [selectedValues.subcategoryType]);

  // Load product styles when product type is selected
  useEffect(() => {
    if (selectedValues.productType) {
      loadProductStyles(selectedValues.productType);
    }
  }, [selectedValues.productType]);


  // Fetch categories from the API
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  // Fetch subcategories for the selected category
  const loadSubcategories = async (categoryId: string) => {
    try {
      const data = await fetchSubcategories(categoryId);
      setSubcategories(data || []);
    } catch (error) {
      toast.error('Failed to load subcategories');
    }
  };

  // Fetch subcategory types for the selected subcategory
  const loadSubcategoryTypes = async (subcategoryId: string) => {
    try {
      const data = await fetchSubcategoryTypes(subcategoryId);
      setSubcategoryTypes(data || []);
    } catch (error) {
      toast.error('Failed to load subcategory types');
    }
  };

  // Fetch product types for the selected subcategory type
  const loadProductTypes = async (subcategoryTypeId: string) => {
    try {
      const data = await fetchProductTypes(subcategoryTypeId);
      setProductTypes(data || []);
    } catch (error) {
      toast.error('Failed to load product types');
    }
  };

  // Fetch product styles for the selected product type
  const loadProductStyles = async (productTypeId: string) => {
    try {
      const data = await fetchProductStyles(productTypeId);
      setProductStyles(data || []);
    } catch (error) {
      toast.error('Failed to load product styles');
    }
  };

  // Open the AddCategoryDialog
  const handleCategoryAddClick = () => {
    setShowCategoryDialog(true);
  };

  // Open the AddSubcategoryDialog
  const handleSubcategoryAddClick = () => {
    if (!selectedValues.category) {
      toast.error('Please select a category first.');
      return;
    }
    setShowSubcategoryDialog(true);
  };

  // Open the AddSubcategoryTypeDialog
  const handleSubcategoryTypeAddClick = () => {
    if (!selectedValues.subcategory) {
      toast.error('Please select a subcategory first.');
      return;
    }
    setSubcategoryIdForType(selectedValues.subcategory); // Set the subcategory ID for subcategory type
    setShowSubcategoryTypeDialog(true);
  };

  // Open the AddProductTypeDialog
  const handleProductTypeAddClick = () => {
    if (!selectedValues.subcategoryType) {
      toast.error('Please select a subcategory type first.');
      return;
    }
    setProductTypeId(selectedValues.subcategoryType); // Set the subcategory_type_id for product type
    setShowProductTypeDialog(true);
  };



  // Open the AddProductStyleDialog
  const handleProductStyleAddClick = () => {
    if (!selectedValues.productType) {
      toast.error('Please select a product type first.');
      return;
    }
    setProductStyleId(selectedValues.productType); // Set the product_type_id for product style
    setShowProductStyleDialog(true);
  };

  // Handle successful dialog actions (e.g., reloading data and closing dialogs)
  const handleSuccess = () => {
    loadCategories();
    setShowCategoryDialog(false);
    setShowSubcategoryDialog(false);
    setShowSubcategoryTypeDialog(false);
    setShowProductTypeDialog(false); // Close product type dialog
    setShowProductStyleDialog(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      {/* Category Select */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            value={selectedValues.category}
            onValueChange={(value) => setSelectedValues(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" onClick={handleCategoryAddClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Subcategory Select */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Subcategory</label>
          <Select
            value={selectedValues.subcategory}
            onValueChange={(value) => setSelectedValues(prev => ({ ...prev, subcategory: value }))}
            disabled={!selectedValues.category}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory.sub_category_id} value={subcategory.sub_category_id}>
                  {subcategory.sub_category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" onClick={handleSubcategoryAddClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Subcategory Type Select */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Subcategory Type</label>
          <Select
            value={selectedValues.subcategoryType}
            onValueChange={(value) => setSelectedValues(prev => ({ ...prev, subcategoryType: value }))}
            disabled={!selectedValues.subcategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Subcategory Type" />
            </SelectTrigger>
            <SelectContent>
              {subcategoryTypes.map((subcategoryType) => (
                <SelectItem key={subcategoryType.sub_category_type_id} value={subcategoryType.sub_category_type_id}>
                  {subcategoryType.sub_category_type_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" onClick={handleSubcategoryTypeAddClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Type Select */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Product Type</label>
          <Select
            value={selectedValues.productType}
            onValueChange={(value) => setSelectedValues(prev => ({ ...prev, productType: value }))}
            disabled={!selectedValues.subcategoryType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Product Type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((productType) => (
                <SelectItem key={productType.product_type_id} value={productType.product_type_id}>
                  {productType.product_type_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" onClick={handleProductTypeAddClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Style Select */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Product Style</label>
          <Select value={selectedValues.productStyle} onValueChange={(value) => setSelectedValues(prev => ({ ...prev, productStyle: value }))} disabled={!selectedValues.productType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Product Style" />
            </SelectTrigger>
            <SelectContent>
              {productStyles.map((productStyle) => (
                <SelectItem key={productStyle.product_style_id} value={productStyle.product_style_id}>
                  {productStyle.product_style_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" onClick={handleProductStyleAddClick}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Dialogs for Adding Category, Subcategory, Subcategory Type, and Product Type */}
      <AddCategoryDialog open={showCategoryDialog} onClose={() => setShowCategoryDialog(false)} onSuccess={handleSuccess} type="category" />
      <AddSubcategoryDialog open={showSubcategoryDialog} onClose={() => setShowSubcategoryDialog(false)} onSuccess={handleSuccess} type="subcategory" parentId={selectedValues.category} />
      <AddSubcategoryTypeDialog
        open={showSubcategoryTypeDialog}
        onClose={() => setShowSubcategoryTypeDialog(false)}
        onSuccess={handleSuccess}
        type="subcategory-type"
        parentId={subcategoryIdForType}  // Pass subcategory_id to subcategory type dialog
      />
      <AddProductTypeDialog
        open={showProductTypeDialog}
        onClose={() => setShowProductTypeDialog(false)}
        onSuccess={handleSuccess}
        type="product-type"
        parentId={selectedValues.subcategoryType || ""}  // Always pass subcategory type id as a string
      />
      <AddProductStyleDialog open={showProductStyleDialog} onClose={() => setShowProductStyleDialog(false)} onSuccess={handleSuccess} type="product-style" productTypeId={selectedValues.productType || ""} />
    </div>
  );
};

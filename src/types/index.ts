export type ComponentType = 
  | 'text-input'
  | 'number-input'
  | 'dropdown'
  | 'radio-group'
  | 'checkbox-group'
  | 'image-picker'
  | 'section'
  | 'product-section'
  | 'button' // Add button type
  | 'alphanumeric-input';

export interface Option {
  id: string;
  label: string;
  value: string;
  imageUrl?: string; // Add imageUrl property
}

export interface FormComponentData {
  id: string;
  type: string;
  label: string;
  name: string;
  icon?: string;
  buttonType?: string;  // Add buttonType property
  variant?: string;     // Add variant property
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  validations?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  children?: FormComponentData[];
  contentCount?: number;
  contentValues?: string[];
  hasGenerateButton?: boolean;
  isLocked?: boolean;
}

export interface DragItem {
  id: string;
  type: string;
  index?: number;
  parentId?: string;
}

export type EntityType = 'category' | 'subcategory' | 'subcategoryType' | 'productType' | 'productStyle';

export interface BaseEntityData {
  name: string;
  description: string;
  image: File | null;
  visibility: boolean;
  show_in_menu: boolean;
  created_time: string;
  type: EntityType;
  parent_id?: string;
}

export interface CategoryData extends BaseEntityData {
  category_name: string;
  type: 'category';
}

export interface EntityData extends BaseEntityData {
  category_name?: string;
}

export interface FormContextType {
  components: FormComponentData[];
  addComponent: (component: FormComponentData, parentId?: string, index?: number) => void;
  updateComponent: (id: string, data: Partial<FormComponentData>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (dragIndex: number, hoverIndex: number, parentId?: string) => void;
  selectedComponent: FormComponentData | null;
  setSelectedComponent: (component: FormComponentData | null) => void;
  isGeneratingForm: boolean;
  setIsGeneratingForm: (generating: boolean) => void;
  generatedForm: FormComponentData[] | null;
  generateForm: () => void;
  formData: Record<string, any>;
  updateFormData: (name: string, value: any) => void;
  resetFormData: () => void;
  submitForm: () => void;
  setComponents: (components: FormComponentData[]) => void; // Add this line
  editGeneratedForm: () => void; // Add this line
  getComponentCount: (type: string) => number; // Add this line
  categoryData: CategoryData | null;
  setCategoryFormData: (data: CategoryData) => void;
  entityData: EntityData | null;
  setEntityFormData: (data: EntityData) => void;
}

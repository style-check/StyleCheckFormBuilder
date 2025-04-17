import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { DragItem, FormComponentData } from "@/types";
import { XCircle } from "lucide-react";
import { useFormContext } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { createNewComponent } from "@/lib/initialData";
import { Button } from "@/components/ui/button";
import { Save, ArrowRightCircle, Tag, Printer, FileText, QrCode, Lock, Plus } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import { fetchCategories } from '@/services/api';
import { AddCategoryDialog } from './AddCategoryDialog';

const iconMap: { [key: string]: any } = {
  Save,
  ArrowRightCircle,
  Tag,
  Printer,
  FileText,
  QrCode,
};

interface FormComponentProps {
  component: FormComponentData;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number, parentId?: string) => void;
  isSelected: boolean;
  onClick: () => void;
  parentId?: string;
}

export const FormComponent: React.FC<FormComponentProps> = ({
  component,
  index,
  moveCard,
  isSelected,
  onClick,
  parentId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { removeComponent, setSelectedComponent, addComponent, components, updateComponent } = useFormContext();
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const loadCategories = async () => {
    if (component.type === 'dropdown' && component.label === 'Select Category') {
      const fetchedCategories = await fetchCategories();
      if (fetchedCategories.length > 0) {
        const options = fetchedCategories.map(category => ({
          id: category.category_id,
          label: category.category_name,
          value: category.category_id,
          imageUrl: category.image_url
        }));
        updateComponent(component.id, { options });
      }
    }
  };

  useEffect(() => {
    loadCategories();
  }, [component.type, component.label]);

  const handleAddCategory = async () => {
    setShowAddCategory(true);
  };

  const handleCategoryAdded = async () => {
    await loadCategories(); // Reload categories after adding
    setShowAddCategory(false);
  };

  const [{ handlerId }, drop] = useDrop({
    accept: "COMPONENT_CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index!;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex, parentId); // Pass parentId for nested moves
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT_CARD",
    item: () => {
      return { id: component.id, index, parentId };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Prevent removal of Category section and its components
    if (component.type === 'section' && component.label === 'Category') {
      toast.error("Category section cannot be removed");
      return;
    }
    if (parentId) {
      const parent = components.find(c => c.id === parentId);
      if (parent?.label === 'Category') {
        toast.error("Category components cannot be removed");
        return;
      }
    }
    removeComponent(component.id);
  };

  const [{ isOver }, sectionDrop] = useDrop({
    accept: "FORM_COMPONENT",
    canDrop: (item: { type: string }) => {
      // Prevent dropping in locked sections
      if (component.type === 'section' && component.label === 'Category') {
        return false;
      }
      return component.type === 'section' && item.type !== 'section';
    },
    drop: (item: { type: string; label: string; icon?: string }, monitor) => {
      if (!monitor.didDrop() && monitor.isOver({ shallow: true })) {
        const componentCount = component.children?.filter((c) => c.type === item.type).length || 0;
        const newComponent = createNewComponent(
          item.type as any,
          componentCount + 1,
          item.label
        );
        addComponent(newComponent, component.id);
        return { dropped: true };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const renderComponentPreview = () => {
    switch (component.type) {
      case "text-input":
        return (
          <div className="form-group">
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              className="form-control"
              type="text"
              placeholder={`Enter ${component.label.toLowerCase()}`}
              disabled
            />
          </div>
        );
      case "number-input":
        if (component.label === "Contents") {
          return (
            <div className="form-group">
              <div className="flex items-center gap-2">
                <Label className="form-label flex-grow">
                  {component.label}
                  {component.required && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-24"
                    placeholder="Count"
                    disabled
                  />
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <FaInfoCircle className="text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="form-group">
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              className="form-control"
              type="number"
              placeholder={`Enter ${component.label.toLowerCase()}`}
              disabled
            />
          </div>
        );
      case "dropdown":
        if (component.label === "Select Category") {
          return (
            <div className="form-group">
              <Label className="form-label">
                {component.label}
                {component.required && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex gap-2">
                <Select disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {component.options?.map((option) => (
                      <SelectItem 
                        key={option.id} 
                        value={option.value}
                        className="flex items-center gap-2"
                      >
                        {option.imageUrl && (
                          <img 
                            src={option.imageUrl} 
                            alt={option.label} 
                            className="w-6 h-6 object-cover rounded"
                          />
                        )}
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCategory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <AddCategoryDialog
                open={showAddCategory}
                onClose={() => setShowAddCategory(false)}
                onSuccess={handleCategoryAdded}
              />
            </div>
          );
        }
        return (
          <div className="form-group">
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${component.label.split(' ')[1]}`} />
              </SelectTrigger>
              <SelectContent>
                {component.options?.map((option) => (
                  <SelectItem 
                    key={option.id} 
                    value={option.value}
                    className="flex items-center gap-2"
                  >
                    {option.imageUrl && (
                      <img 
                        src={option.imageUrl} 
                        alt={option.label} 
                        className="w-6 h-6 object-cover rounded"
                      />
                    )}
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "radio-group":
        return (
          <div className="form-group">
            <Label className="form-label mb-2 block">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup disabled className="flex flex-col space-y-1">
              {component.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${component.id}-${option.id}`}
                  />
                  <Label htmlFor={`${component.id}-${option.id}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case "checkbox-group":
        return (
          <div className="form-group">
            <Label className="form-label mb-2 block">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex flex-col space-y-1">
              {component.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={`${component.id}-${option.id}`} disabled />
                  <Label htmlFor={`${component.id}-${option.id}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case "image-picker":
        return (
          <div className="form-group">
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                  >
                    <span>Upload an image</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        );
      case "section":
        const isLockedSection = component.label === 'Category';
        return (
          <div
            ref={isLockedSection ? null : sectionDrop}
            className={cn(
              "form-group p-4 border border-dashed rounded-md",
              isLockedSection ? "bg-gray-100" : "bg-secondary/30",
              isOver && !isLockedSection && "border-primary border-2"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <Label className="form-label text-lg">
                {component.label}
                {component.required && <span className="text-red-500">*</span>}
              </Label>
              {isLockedSection && (
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Locked
                </div>
              )}
            </div>
            <div className="mt-4 space-y-4">
              {component.children?.map((child, childIndex) => (
                <FormComponent
                  key={child.id}
                  component={child}
                  index={childIndex}
                  moveCard={(dragIndex, hoverIndex) =>
                    moveCard(dragIndex, hoverIndex, component.id)
                  }
                  isSelected={isSelected}
                  onClick={() => setSelectedComponent(child)}
                  parentId={component.id}
                />
              ))}
              {(!component.children || component.children.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Drag components here
                </p>
              )}
            </div>
          </div>
        );
      case "button":
        const getButtonStyle = () => {
          switch (component.buttonType) {
            case "save-product":
              return "bg-green-600 hover:bg-green-700";
            case "save-next":
              return "bg-blue-600 hover:bg-blue-700";
            case "generate-sku":
              return "bg-purple-600 hover:bg-purple-700";
            case "print-mrp":
              return "bg-orange-600 hover:bg-orange-700";
            case "print-catalogue":
              return "bg-red-600 hover:bg-red-700";
            case "qr-code":
              return "bg-indigo-600 hover:bg-indigo-700";
            default:
              return "bg-gray-600 hover:bg-gray-700";
          }
        };

        const IconComponent = component.icon ? iconMap[component.icon] : null;

        return (
          <div className="form-group">
            <Button
              className={`w-full text-white font-semibold ${getButtonStyle()}`}
              disabled
            >
              <span className="flex items-center gap-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {component.label}
              </span>
            </Button>
          </div>
        );
      case "alphanumeric-input":
        return (
          <div className="form-group">
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex gap-2">
              <Input
                className="form-control"
                type="text"
                placeholder={`Enter ${component.label.toLowerCase()}`}
                disabled
              />
              {component.hasGenerateButton && (
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled
                >
                  Generate {component.label}
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "draggable-component relative component-enter",
        isSelected && "component-highlight",
        isDragging && "opacity-0"
      )}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {renderComponentPreview()}
      <button
        className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 hover:text-destructive/80 transition-opacity duration-200"
        onClick={handleRemove}
      >
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  );
};
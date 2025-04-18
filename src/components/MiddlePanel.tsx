import React from "react";
import { useDrop } from "react-dnd";
import { useFormContext } from "@/context/FormContext";
import { FormComponent } from "./FormComponent";
import { createNewComponent } from "@/lib/initialData";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { useLocation } from 'react-router-dom';

export const MiddlePanel = () => {
  const {
    components,
    addComponent,
    moveComponent,
    selectedComponent,
    setSelectedComponent,
    entityData,
  } = useFormContext();

  const location = useLocation();
  const locationState = location.state as { entityData?: any };

  // Use either context data or location state
  const displayData = entityData || locationState?.entityData;

  const moveCard = (dragIndex: number, hoverIndex: number, parentId?: string) => {
    moveComponent(dragIndex, hoverIndex, parentId);
  };

  const [{ isOver }, drop] = useDrop({
    accept: ["FORM_COMPONENT", "COMPONENT_CARD"],
    drop: (item: { type: string; id?: string; label?: string; icon?: string }, monitor) => {
      // Only handle drop if it's directly on the middle panel and not already handled
      if (!monitor.didDrop() && monitor.isOver({ shallow: true })) {
        const componentCount = components.filter((c) => c.type === item.type).length;
        const newComponent = createNewComponent(
          item.type as any,
          componentCount + 1,
          item.label
        );
        // Add the component with any default children
        addComponent(newComponent);
        return { dropped: true };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }) && !monitor.didDrop(),
    }),
  });

  const isEmpty = components.length === 0;

  return (
    <div className="w-2/4 p-4 h-[calc(100vh-73px)] overflow-y-auto space-y-6">
      {displayData && (
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {displayData.image instanceof File ? (
                  <img 
                    src={URL.createObjectURL(displayData.image)}
                    alt={displayData.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {displayData.name}
                </h2>
                <span className="text-sm text-gray-500">
                  Created: {new Date(displayData.created_time).toLocaleString()}
                </span>
              </div>
              <div className="space-y-4">
                {displayData.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-gray-700">{displayData.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="mt-1 text-gray-700 capitalize">{displayData.type}</p>
                  </div>
                  {displayData.parent_id && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Parent ID</h3>
                      <p className="mt-1 text-gray-700">{displayData.parent_id}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Visibility</h3>
                    <p className="mt-1 text-gray-700">{displayData.visibility ? 'Visible' : 'Hidden'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Menu Display</h3>
                    <p className="mt-1 text-gray-700">{displayData.show_in_menu ? 'Shown in Menu' : 'Hidden from Menu'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Builder Drop Area */}
      <div
        ref={drop}
        className={cn(
          "form-canvas min-h-[calc(100vh-120px)]",
          isEmpty && "empty",
          isOver && "drag-over"
        )}
      >
        {isEmpty ? (
          <div className="text-center p-8 flex flex-col items-center justify-center text-muted-foreground">
            <LayoutDashboard className="w-12 h-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium mb-1">Your form is empty</h3>
            <p className="text-sm max-w-xs">
              Drag components from the left panel to start building your form
            </p>
          </div>
        ) : (
          components.map((component, index) => (
            <FormComponent
              key={component.id}
              index={index}
              component={component}
              moveCard={moveCard}
              isSelected={selectedComponent?.id === component.id}
              onClick={() => setSelectedComponent(component)}
            />
          ))
        )}
      </div>
    </div>
  );
};
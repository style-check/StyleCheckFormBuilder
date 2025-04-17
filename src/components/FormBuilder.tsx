import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "./LeftPanel";
import { MiddlePanel } from "./MiddlePanel";
import { RightPanel } from "./RightPanel";
import { GeneratedForm } from "./GeneratedForm";
import { FormProvider, useFormContext } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const FormBuilderContent = () => {
  const navigate = useNavigate();
  const { generateForm, generatedForm, isGeneratingForm } = useFormContext();

  const handleBackToEditor = () => {
    console.log("Back to editor");
    navigate("/"); // Ensure navigation works
  };

  const handleBackToMain = () => {
    console.log("Back to main page");
    navigate("/index"); // Navigate to main index page
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {generatedForm ? (
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Return to Home
            </a>
          </div>

          <GeneratedForm />
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center px-6 py-4 border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
            <div>
              <h1 className="text-2xl font-semibold">Form Builder</h1>
              <p className="text-muted-foreground text-sm">
                {isGeneratingForm ? "Edit your generated form" : "Drag and drop components to build your form"}
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/category')}>
                Manage Categories
              </Button>
              <Button onClick={generateForm}>Generate Form</Button>
            </div>
          </header>
          <div className="flex-1 flex overflow-hidden">
            <LeftPanel />
            <MiddlePanel />
            <RightPanel />
          </div>
        </>
      )}
    </div>
  );
};

export const FormBuilder = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormProvider>
        <FormBuilderContent />
      </FormProvider>
    </DndProvider>
  );
};

export default FormBuilder;

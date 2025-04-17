
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FormBuilder from "@/components/FormBuilder";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <DndProvider backend={HTML5Backend}>
        <FormBuilder />
      </DndProvider>
    </div>
  );
};

export default Index;

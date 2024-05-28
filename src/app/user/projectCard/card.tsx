import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import './styles.css';
import React, { useState } from 'react';
import { addProject } from "@/requests/requests";

interface Props {
  style?: React.CSSProperties;
  onProjectAdded: () => void; // Add the new prop type
}

const DialogDemo: React.FC<Props> = ({ onProjectAdded }) => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false); // State to control dialog open/close

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError('Project name cannot be empty');
      return;
    }

    try {
      // Call the API to add the project
      await addProject({ name: projectName });
      console.log('Project added successfully:', projectName);

      // Reset fields and close dialog
      setProjectName('');
      setError('');
      setOpen(false); // Close the dialog

      // Notify the parent component to re-fetch projects
      onProjectAdded();
    } catch (error) {
      console.error('Error adding project:', error);
      setError('Failed to add project');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Create New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="dialog-content sm:max-w-[425px]">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">Create Project</DialogTitle>
            <DialogDescription className="dialog-description">
              Fill in the form to create a new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right dialog-label">
                Name
              </Label>
              <Input 
                id="name" 
                className="col-span-3 dialog-input" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-red-500 mt-2 text-sm">Error: {error}</p>
            )}
          </div>
          <DialogFooter className="dialog-footer">
            <Button type="button" className="dialog-button" onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogDemo;

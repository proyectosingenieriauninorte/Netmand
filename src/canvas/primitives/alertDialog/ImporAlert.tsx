import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FC, forwardRef, useEffect, useState } from 'react';
import { EventBus } from "@/canvas/EventBus";
import './styles.css';
import { NetworkData } from "@/canvas/scenes/canva";

interface AlertDialogProps {
  style?: React.CSSProperties;
}

export const ImportAlert: FC<AlertDialogProps> = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [importData, setImportData] = useState<NetworkData | null>(null);

  const importAndSaveAction = async () => {
      setOpen(false);
      if (importData) {
          // Export the current project and then import the new one
          EventBus.emit('importAndSave', importData);
      }
  };
  
  const importAction = () => {
      setOpen(false);
      if (importData) {
          EventBus.emit('importAnyways', importData);
          EventBus.emit('showAlert', 'Project imported successfully');
          setTimeout(() => {
            EventBus.emit('hideAlert');
        }, 3000);
      }
  };

  useEffect(() => {
      const showDialog = (data: NetworkData) => {
          setImportData(data);
          setOpen(true);
      };
      
      EventBus.on('showImportAlert', showDialog);

      return () => {
          EventBus.off('showImportAlert', showDialog);
      };
  }, []);

  return (
      <div id='alertDialog'>
          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent className="AlertDialogContent">
                  <AlertDialogHeader className="AlertDialogHeader">
                      <AlertDialogTitle className="AlertDialogTitle">Import?</AlertDialogTitle>
                      <AlertDialogDescription className="AlertDialogDescription">
                          If you import this project, your current work will be lost. Make sure to save your work before importing.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="AlertDialogFooter">
                      <AlertDialogCancel className="AlertDialogAction" onClick={importAndSaveAction}>Save & Import</AlertDialogCancel>
                      <AlertDialogCancel className="AlertDialogAction" onClick={importAction}>Import</AlertDialogCancel>
                      <AlertDialogCancel className="AlertDialogCancel" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
  );
});

export default ImportAlert;

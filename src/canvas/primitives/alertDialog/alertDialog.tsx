import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { use } from "matter";
import { FC, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { EventBus } from "@/canvas/EventBus";
import './styles.css';

interface AlertDialogProps {
    style?: React.CSSProperties;
}

export const AlertDialogDemo: FC<AlertDialogProps> = forwardRef((_, ref) => {

    const [open, setOpen] = useState(false);
    
    const confirmAction = () => {
        () => setOpen(false);
        EventBus.emit('confirmDeletion');

        EventBus.emit('showAlert', 'Component deleted successfully!');
        setTimeout(() => {
          EventBus.emit('hideAlert');
        }, 3000);
    }

    useEffect(() => {
        const dialog = document.getElementById('alertDialog');
        if (dialog) {
            dialog.style.display = 'none';
        }

        const showDialog = () => {
            setOpen(true);
        };
        
        EventBus.on('showAlertDialog', showDialog);
    }, []);

    return (
      <div id='alertDialog'>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" style={{ pointerEvents: 'all' }}>Show Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="AlertDialogContent">
            <AlertDialogHeader className="AlertDialogHeader">
              <AlertDialogTitle className="AlertDialogTitle">Delete Permanently?</AlertDialogTitle>
              <AlertDialogDescription className="AlertDialogDescription">
                This version of Netmand is still in beta. You can not undo this action once you continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="AlertDialogFooter">
              <AlertDialogCancel className="AlertDialogCancel" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogCancel className="AlertDialogAction" onClick={confirmAction}>Continue</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
});

export default AlertDialogDemo;

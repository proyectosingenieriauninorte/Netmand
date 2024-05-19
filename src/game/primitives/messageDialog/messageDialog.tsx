import { FC, useEffect } from 'react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import './styles.css';
import { Terminal } from "lucide-react";
import { EventBus } from "@/game/EventBus";

interface AlertDemoProps {
    message: string | null;
}

export const AlertDemo: FC<AlertDemoProps> = ({ message }) => {

    useEffect(() => {
        const showAlertHandler = (message: string) => {
            const dialogElement = document.getElementById('alert-dialog');
            if (dialogElement) {
                dialogElement.classList.remove('hide');
                dialogElement.classList.add('visible');
            }
        };

        const hideAlertHandler = () => {
            const dialogElement = document.getElementById('alert-dialog');
            if (dialogElement) {
                dialogElement.classList.remove('visible');
                dialogElement.classList.add('hide');
            }
        };

        EventBus.on('showAlert', showAlertHandler);
        EventBus.on('hideAlert', hideAlertHandler);

        return () => {
            EventBus.off('showAlert', showAlertHandler);
            EventBus.off('hideAlert', hideAlertHandler);
        };

    }, []);

    return (
        <div id="alert-dialog" className="alert-dialog hide">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Incoming Message</AlertTitle>
                <AlertDescription className="alert-description">{message}</AlertDescription>
            </Alert>
        </div>
    );
};

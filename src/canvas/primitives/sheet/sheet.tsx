"use client";
import { FC, forwardRef, useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import './styles.css';
import { EventBus } from "@/canvas/EventBus";
import { Terminal } from "lucide-react";

const SHEET_SIDES = ["right"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

interface SheetProps {
  style?: React.CSSProperties;
}

interface Commands {
  pcsCommands: string[][];
  switchesCommands: string[][];
  routersCommands: string[][];
}

let fetchedCommands: Commands;

export const SheetSide: FC<SheetProps> = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);

  useEffect(() => {
    const showCommands = (component: { id: number, type: string }) => {

      // AQUI SE LLAMA A LA FUNCION 
      // fetchCommands = A LO QUE RETORNA EL BACKEND;

      if (!fetchedCommands) {
        setCommands(['']);
        setOpen(true);
        return;
      }

      let commandsArray: string[] = [];

      switch (component.type) {
        case 'Pc':
          commandsArray = fetchedCommands?.pcsCommands?.[component.id] || [];
          break;
        case 'Switch':
          commandsArray = fetchedCommands?.switchesCommands?.[component.id] || [];
          break;
        case 'Router':
          commandsArray = fetchedCommands?.routersCommands?.[component.id] || [];
          break;
        default:
          commandsArray = [];
      }

      // If commandsArray is empty, set it to ['']
      if (commandsArray.length === 0) {
        commandsArray = [''];
      }

      setCommands(commandsArray);
      setOpen(true);
    };

    EventBus.on('showCommands', showCommands);

    return () => {
      EventBus.off('showCommands', showCommands);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setCommands([]); // Clear commands when the sheet is closed
    }
  }, [open]);

  return (
    <div className="SheetSideContainer" style={{ pointerEvents: 'auto', position: 'absolute', bottom: '2%' }}>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side} open={open} onOpenChange={setOpen}>
          <SheetContent side={side} className="SheetContent">
            <SheetHeader className="SheetHeader">
              <SheetTitle className="SheetTitle">Commands Visualization</SheetTitle>
              <SheetDescription className="SheetDescription">
                Here you can see the commands for the selected component
              </SheetDescription>
            </SheetHeader>
            <div className="terminal">
              {commands.map((command, cmdIndex) => (
                <div key={cmdIndex} className="flex">
                  <Terminal className="h-4 w-4 mr-3" />
                  <pre className="terminal-line">{command}</pre>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
});

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
import { Commands as cmd } from '@/commands/commands';

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

let fetchedCommandsInstance: cmd | null = null;

export const SheetSide: FC<SheetProps> = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);

  useEffect(() => {

    const handleFetchedCommands = (commands: Commands) => {
      fetchedCommandsInstance = new cmd(commands); 
    };

    EventBus.on('fetchedCommands', handleFetchedCommands);

    // Add event listener for showCommands
    const showCommands = (component: { id: number, type: string }) => {

      if (!fetchedCommandsInstance) {
        setCommands(['']);
        setOpen(true);
        return;
      }

      let commandsArray: string[] = [];

      switch (component.type) {
        case 'Pc':
          commandsArray = fetchedCommandsInstance?.pcsCommands?.[component.id] || [];
          break;
        case 'Switch':
          commandsArray = fetchedCommandsInstance?.switchesCommands?.[component.id] || [];
          break;
        case 'Router':
          commandsArray = fetchedCommandsInstance?.routersCommands?.[component.id] || [];
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

    // Clean up event listeners on unmount
    return () => {
      EventBus.off('fetchedCommands', handleFetchedCommands);
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
          <SheetContent side={side} className={`SheetContent ${open ? 'slide-in' : 'slide-out'}`}>
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

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import './styles.css';
import { FC, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { EventBus } from "@/canvas/EventBus";

const SHEET_SIDES = ["right"] as const

type SheetSide = (typeof SHEET_SIDES)[number]

interface SheetProps{
  style?: React.CSSProperties;
}


export const SheetSide: FC<SheetProps> = forwardRef((_, ref) => {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showCommands = () => {
        setOpen(true);
    };
    
    EventBus.on('showCommands', showCommands);
}, []);

  return (
    <div className="SheetSideContainer" style={{pointerEvents:'auto', position: 'absolute', bottom: '2%'}}>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side} open={open} onOpenChange={setOpen}>
          <SheetContent side={side} className="SheetContent">
            <SheetHeader className="SheetHeader">
              <SheetTitle className="SheetTitle">Visualización de Comandos</SheetTitle>
              <SheetDescription className="SheetDescription">
                Selecciona el componente para visualizar sus comandos.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4 SheetForm">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right Label">Name</Label>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right Label">Username</Label>
              </div>
            </div>
            <SheetFooter className="SheetFooter">
              <SheetClose asChild>
                <Button type="submit" className="SaveButton">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
});

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { FC, useState, forwardRef, useEffect} from 'react';
import { EventBus } from '@/canvas/EventBus';
import { Pc, Router } from '@/canvas/components/netComponents';

interface PcPortMenuProps {
    style?: React.CSSProperties;
}

const SwitchProperties: FC<PcPortMenuProps> = forwardRef((_, ref) => {

    const [open, setOpen] = useState(false);
    const [switchProps] = useState<{
        ports: {object: Pc | Router | null, vlan: string;}[];
        identifier: string;
    }>({
        ports: [{object: null, vlan: ''}],
        identifier: ''
    });

    useEffect(() => {

        const showDialog = () => {
            setOpen(true);
        };
        
        EventBus.on('showSwitchProperties', (data: {ports: {object: Pc | Router | null, vlan: string;}[], identifier: number}) => {
            switchProps.ports = data.ports;
            switchProps.identifier = data.identifier.toString();
            showDialog();
        });


    }, []);

    return (
        <div id='pcProp' style={{position: 'absolute', pointerEvents: 'auto'}}>
            <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal >
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">PROPIEDADES DE SWITCH {switchProps.identifier}</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                Realiza los cambios que deseas en los recuadros de texto.
                </Dialog.Description>

                <fieldset className="Fieldset">
                <label className="Label" htmlFor="Dirección IP">
                    Dirección IP
                </label>
                <input className="Input" id="ip" />
                </fieldset>
                
                <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                <Dialog.Close asChild>
                    <button className="Button green">Save changes</button>
                </Dialog.Close>
                </div>
                <Dialog.Close asChild>
                <button className="IconButton" aria-label="Close">
                    <Cross2Icon />
                </button>
                </Dialog.Close>
            </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root> 
        </div>
    
        );
});

export default SwitchProperties;
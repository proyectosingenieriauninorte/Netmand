import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { FC, useState, forwardRef, useEffect} from 'react';
import { EventBus } from '@/canvas/EventBus';

interface PcPortMenuProps {
    style?: React.CSSProperties;
}

const PcProperties: FC<PcPortMenuProps> = forwardRef((_, ref) => {

    const [open, setOpen] = useState(false);
    const [pcProps] = useState<{
        ip: string;
        mask: string;
        red: string;
        net: string;
        gateway: string;
        identifier: string;
    }>({
        ip: '',
        mask: '',
        red: '',
        net: '',
        gateway: '',
        identifier: ''
    });

    useEffect(() => {

        const showDialog = () => {
            setOpen(true);
        };
        
        EventBus.on('showPcProperties', (data: {ip: string, mask: string, red: string, net: string, gateway:string, identifier: string}) => {
            pcProps.ip = data.ip;
            pcProps.mask = data.mask;
            pcProps.red = data.red;
            pcProps.net = data.net;
            pcProps.gateway = data.gateway;
            pcProps.identifier = data.identifier;
            showDialog();
        });


    }, []);

    return (
        <div id='pcProp' style={{position: 'absolute', pointerEvents: 'auto'}}>
            <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal >
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">PROPIEDADES DE PC {pcProps.identifier}</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                Realiza los cambios que deseas en los recuadros de texto.
                </Dialog.Description>

                <fieldset className="Fieldset">
                <label className="Label" htmlFor="Dirección IP">
                    Dirección IP
                </label>
                <input className="Input" id="ip" defaultValue={pcProps.ip}/>
                </fieldset>

                <fieldset className="Fieldset">
                <label className="Label" htmlFor="Máscara">
                    Máscara 
                </label>
                <input className="Input" id="mask" defaultValue={pcProps.mask}/>
                </fieldset>

                <fieldset className="Fieldset">
                <label className="Label" htmlFor="Gateway">
                    Gateway
                </label>
                <input className="Input" id="gateway" defaultValue={pcProps.gateway}/>
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

export default PcProperties;
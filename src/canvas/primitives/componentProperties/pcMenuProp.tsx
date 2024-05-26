import React, { FC, useState, useEffect, forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { EventBus } from '@/canvas/EventBus';

interface PcPortMenuProps {
    style?: React.CSSProperties;
}

const PcProperties: FC<PcPortMenuProps> = forwardRef((_, ref) => {
    const [open, setOpen] = useState(false);
    const [pcProps, setPcProps] = useState<{
        ip: string;
        mask: string;
        red: string;
        gateway: string;
        identifier: string;
        type: string;
    }>({
        ip: '',
        mask: '',
        red: '',
        gateway: '',
        identifier: '',
        type: ''
    });

    useEffect(() => {
        const showDialog = (data: { ip: string, mask: string, red: string, gateway: string, identifier: string, type:string}) => {
            setPcProps(data);
            setOpen(true);
        };

        EventBus.on('showPcProperties', showDialog);

        return () => {
            EventBus.off('showPcProperties', showDialog);
        };
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setPcProps(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSaveChanges = () => {
        EventBus.emit('savePcData', pcProps);
        setOpen(false);
        EventBus.emit('showAlert', 'Changes saved successfully!');
        setTimeout(() => {
            EventBus.emit('hideAlert');
        }, 3000);
    };

    return (
        <div id='pcProp' style={{ position: 'absolute', pointerEvents: 'auto' }}>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Title className="DialogTitle">PROPIEDADES DE PC {pcProps.identifier}</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                            Realiza los cambios que deseas en los recuadros de texto.
                        </Dialog.Description>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="ip">Dirección IP</label>
                            <input
                                className="Input"
                                id="ip"
                                value={pcProps.ip}
                                onChange={(e) => handleInputChange('ip', e.target.value)}
                            />
                        </fieldset>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="mask">Máscara</label>
                            <input
                                className="Input"
                                id="mask"
                                value={pcProps.mask}
                                onChange={(e) => handleInputChange('mask', e.target.value)}
                            />
                        </fieldset>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="gateway">Gateway</label>
                            <input
                                className="Input"
                                id="gateway"
                                value={pcProps.gateway}
                                onChange={(e) => handleInputChange('gateway', e.target.value)}
                            />
                        </fieldset>

                        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                            <Dialog.Close asChild>
                                <button className="Button green" onClick={handleSaveChanges}>Save changes</button>
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

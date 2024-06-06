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
    const [errorMessage, setErrorMessage] = useState<string>('');

    const validateIP = (value: string) => {
        const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
        return regex.test(value);
    };

    const validateMask = (value: string) => {
        const regex = /^(255).(0|128|192|224|240|248|252|254|255).(0|128|192|224|240|248|252|254|255).(0|128|192|224|240|248|252|254|255)/;
        return regex.test(value);
    };

    const validateGateway = (value: string) => {
        return validateIP(value);
    };

    useEffect(() => {
        const showDialog = (data: { ip: string, mask: string, red: string, gateway: string, identifier: string, type: string }) => {
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
        const errors = [];

        if (!validateIP(pcProps.ip)) {
            errors.push('Invalid IP address.');
        }
        if (!validateMask(pcProps.mask)) {
            errors.push('Invalid Mask.');
        }
        if (!validateGateway(pcProps.gateway)) {
            errors.push('Invalid Gateway.');
        }

        if (errors.length > 0) {
            setErrorMessage(errors.join(' '));
            return;
        }

        setErrorMessage('');
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
                        <Dialog.Title className="DialogTitle">PC {pcProps.identifier} PROPERTIES</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                            Make the desired changes in the text boxes.
                        </Dialog.Description>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="ip">IP</label>
                            <input
                                className="Input"
                                id="ip"
                                value={pcProps.ip}
                                onChange={(e) => handleInputChange('ip', e.target.value)}
                            />
                        </fieldset>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="mask">Mask</label>
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

                        {errorMessage && (
                            <div className="ErrorMessage">{errorMessage}</div>
                        )}

                        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                            <button className="Button green" onClick={handleSaveChanges}>Save changes</button>
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

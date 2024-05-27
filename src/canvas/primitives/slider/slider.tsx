import React, { FC, forwardRef, useEffect, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import './styles.css';
import { EventBus } from '@/canvas/EventBus';

interface SliderProps {
    styles: React.CSSProperties;
}

const SliderDemo: FC<SliderProps> = forwardRef((_, ref) => {
    const [sliderValue, setSliderValue] = useState(50); // Initial value should match the defaultValue

    const handleSliderChange = (value: number) => {
        console.log(value);
        setSliderValue(value);
        // Emit an event with the slider value
        EventBus.emit('sliderChange', value);
    };

    useEffect(() => {
        const updateSliderHandler = (value: number) => {
            setSliderValue(value);
        };

        EventBus.on('updateSlider', updateSliderHandler);

        return () => {
            // Clean up event listener
            EventBus.off('updateSlider', updateSliderHandler);
        };
    }, []);

    return (
        <div id='zoom-container' style={{ pointerEvents: 'auto' }}>
            <form>
                <Slider.Root
                    className="SliderRoot"
                    value={[sliderValue]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleSliderChange(value[0])}
                >
                    <Slider.Track className="SliderTrack">
                        <Slider.Range className="SliderRange" />
                    </Slider.Track>
                    <Slider.Thumb className="SliderThumb" aria-label="Volume" />
                </Slider.Root>
            </form>
        </div>
    );
});

export default SliderDemo;

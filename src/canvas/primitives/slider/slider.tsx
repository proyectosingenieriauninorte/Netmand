import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import './styles.css';
import { FC, forwardRef, useEffect } from 'react';
import { EventBus } from '@/canvas/EventBus';

interface sliderProps {
    styles: React.CSSProperties;
}

const SliderDemo: FC<sliderProps> = forwardRef((_, ref) => {

    const handleSliderChange = (value: number) => {
        console.log(value);
        // Emit an event with the slider value
        EventBus.emit('sliderChange', value);
    };

    useEffect(() => {
        
        return () => {
            // Clean up event listener
            EventBus.off('sliderChange', handleSliderChange);
        };
    }, []);

    return (
        <div id='zoom-container' style={{pointerEvents:'auto'}}>
            <form>
                <Slider.Root className="SliderRoot" defaultValue={[50]} max={100} step={1} onValueChange={(value) => handleSliderChange(value[0])}>
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
/*
import { Scene } from 'phaser';
import { Cable } from '../components/netComponents';

export class cableManager{
    scene: Scene;
    cables: Cable[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
        this.scene.input.on('pointer', this.handleDrag.bind(this));
        this.scene.input.on('dragstart', this.startDrag.bind(this));
    }

    private startDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number){
        
    }
    
    private handleDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) {
        
    }
    
    private updateCablesPosition(gameObject: Phaser.GameObjects.Image) {
        if (this.cables.length > 0) {
            const gameObjectBounds = gameObject.getBounds(); // Get bounding box of dragged object
            for (const cable of this.cables) {
                // Check if cable's start or end point is within the bounds of the dragged object
                if (this.isPointWithinBounds(cable.startComponent, gameObjectBounds) || this.isPointWithinBounds(cable.endComponent, gameObjectBounds)) {
                    // Update cable's start or end point to match dragged object's position
                    if (this.isPointWithinBounds(cable.startComponent, gameObjectBounds)) {
                        cable.StartCoordinates({ x: gameObject.x, y: gameObject.y });
                    }
                    if (this.isPointWithinBounds(cable.endComponent, gameObjectBounds)) {
                        cable.EndCoordinates({ x: gameObject.x, y: gameObject.y });
                    }
                }
            }
        }
    }
    
    private isPointWithinBounds(point: { x: number, y: number }, bounds: Phaser.Geom.Rectangle): boolean {
        // Check if point's coordinates are within the bounds of the object's bounding box
        return Phaser.Geom.Rectangle.ContainsPoint(bounds, new Phaser.Geom.Point(point.x, point.y));
    } 
}

*/


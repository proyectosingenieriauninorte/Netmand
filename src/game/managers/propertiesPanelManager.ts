import { Scene } from 'phaser';
import styles from '../../app/project/project.module.css'

export class PropertiesPanel {
    private propertiesPanel: HTMLElement;
    private pcPropertiesPanel: HTMLElement;
    private propertiesPanelVisible: boolean = false;
    

    constructor() {
        this.createPropertiesPanel()
        this.createPcProperties()
    }

    private createPropertiesPanel() {
        const canvasContainer = document.getElementById('canva-container');
        if (canvasContainer) {
            this.propertiesPanel = document.createElement('div');
            this.propertiesPanel.style.width = canvasContainer.clientWidth.toString();
            this.propertiesPanel.style.height = canvasContainer.clientHeight.toString();
            this.propertiesPanel.style.padding = '0px';
            this.propertiesPanel.style.marginRight = '0px';
            this.propertiesPanel.style.marginBottom = '0px';
            this.propertiesPanel.style.position = 'absolute';
            this.propertiesPanel.style.overflow = 'hidden';
            this.propertiesPanel.style.transform = 'scale(1, 1)';
            this.propertiesPanel.style.transformOrigin = 'left top';
            canvasContainer.insertBefore(this.propertiesPanel, canvasContainer.firstChild);
            this.hidePropertiesPanel(false)
        }
    }

    public hidePropertiesPanel(flag: boolean) {
        this.propertiesPanelVisible = flag;
        if (this.propertiesPanelVisible) {
            this.propertiesPanel.style.display = 'block';
        }else{
            this.propertiesPanel.style.display = 'none';
        }
    }

    public createPcProperties(){

        this.pcPropertiesPanel = document.createElement('div');
        this.pcPropertiesPanel.innerHTML = `
            <div class="${styles.common}">
                <label for="net">Net:</label>
                <button id="close" class="${styles.common}">Delete</button>
                <input type="text" id="net" name="net" class="${styles.common}"> 
                <label for="ip">IP:</label>
                <input type="text" id="ip" name="ip" class="${styles.common}"> 
                <select id="net-options" name="net-options" class="${styles.common}"> 
                    <option value="network1">Network 1</option>
                    <option value="network2">Network 2</option>
                    <option value="network3">Network 3</option>
                    <!-- Add more network options as needed -->
                </select>
            </div>
        `;
    
        // Add event listener to the "Delete" button
        const closeButton = this.pcPropertiesPanel.querySelector('#close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closePropertiesPanel();
            });
        }
        this.propertiesPanel.appendChild(this.pcPropertiesPanel);
    }

    private closePropertiesPanel(){
        console.log('closePro')
        this.hidePropertiesPanel(false)
    }

}

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import './styles.css';


const TabsDemo = () => (
  <Tabs.Root className="TabsRoot" defaultValue="tab1">
    <Tabs.List className="TabsList" aria-label="Manage your account">
      <Tabs.Trigger className="TabsTrigger flex" value="tab1">
        Propiedades PC
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content className="TabsContent" value="tab1">
      <p className="Text">Actualiza las propiedades en este recuadro.</p>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="name">
          Dirección de red
        </label>
        <input className="Input" id="net" defaultValue="red" />
      </fieldset>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="name">
          Máscara de red
        </label>
        <input className="Input" id="net" defaultValue="Máscara" />
      </fieldset>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="IP">
          Dirección IP
        </label>
        <input className="Input" id="username" defaultValue="ip" />
      </fieldset>
      <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
        <button className="Button green">Cerrar</button>
      </div>
    </Tabs.Content>
  </Tabs.Root>
);

export default TabsDemo;
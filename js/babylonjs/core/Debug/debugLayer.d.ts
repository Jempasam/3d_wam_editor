import { Scene } from "../scene";
import type { IInspectable } from "../Misc/iInspectable";
import type { Camera } from "../Cameras/camera";
/**
 * Interface used to define scene explorer extensibility option
 */
export interface IExplorerExtensibilityOption {
    /**
     * Define the option label
     */
    label: string;
    /**
     * Defines the action to execute on click
     */
    action: (entity: any) => void;
    /**
     * Keep popup open after click
     */
    keepOpenAfterClick?: boolean;
}
/**
 * Defines a group of actions associated with a predicate to use when extending the Inspector scene explorer
 */
export interface IExplorerExtensibilityGroup {
    /**
     * Defines a predicate to test if a given type mut be extended
     */
    predicate: (entity: any) => boolean;
    /**
     * Gets the list of options added to a type
     */
    entries: IExplorerExtensibilityOption[];
}
/**
 * Defines a new node that will be displayed as top level node in the explorer
 */
export interface IExplorerAdditionalChild {
    /**
     * Gets the name of the additional node
     */
    name: string;
    /**
     * Function used to return the class name of the child node
     */
    getClassName(): string;
    /**
     * List of inspectable custom properties (used by the Inspector)
     * @see https://doc.babylonjs.com/toolsAndResources/inspector#extensibility
     */
    inspectableCustomProperties: IInspectable[];
}
/**
 * Defines a new node that will be displayed as top level node in the explorer
 */
export interface IExplorerAdditionalNode {
    /**
     * Gets the name of the additional node
     */
    name: string;
    /**
     * Function used to return the list of child entries
     */
    getContent(): IExplorerAdditionalChild[];
}
export type IInspectorContextMenuType = "pipeline" | "node" | "materials" | "spriteManagers" | "particleSystems";
/**
 * Context menu item
 */
export interface IInspectorContextMenuItem {
    /**
     * Display label - menu item
     */
    label: string;
    /**
     * Callback function that will be called when the menu item is selected
     * @param entity the entity that is currently selected in the scene explorer
     */
    action: (entity?: unknown) => void;
}
/**
 * Interface used to define the options to use to create the Inspector
 */
export interface IInspectorOptions {
    /**
     * Display in overlay mode (default: false)
     */
    overlay?: boolean;
    /**
     * HTML element to use as root (the parent of the rendering canvas will be used as default value)
     */
    globalRoot?: HTMLElement;
    /**
     * Display the Scene explorer
     */
    showExplorer?: boolean;
    /**
     * Display the property inspector
     */
    showInspector?: boolean;
    /**
     * Display in embed mode (both panes on the right)
     */
    embedMode?: boolean;
    /**
     * let the Inspector handles resize of the canvas when panes are resized (default to true)
     */
    handleResize?: boolean;
    /**
     * Allow the panes to popup (default: true)
     */
    enablePopup?: boolean;
    /**
     * Allow the panes to be closed by users (default: true)
     */
    enableClose?: boolean;
    /**
     * Optional list of extensibility entries
     */
    explorerExtensibility?: IExplorerExtensibilityGroup[];
    /**
     * Optional list of additional top level nodes
     */
    additionalNodes?: IExplorerAdditionalNode[];
    /**
     * Optional URL to get the inspector script from (by default it uses the babylonjs CDN).
     */
    inspectorURL?: string;
    /**
     * Optional initial tab (default to DebugLayerTab.Properties)
     */
    initialTab?: DebugLayerTab;
    /**
     * Optional camera to use to render the gizmos from the inspector (default to the scene.activeCamera or the latest from scene.activeCameras)
     */
    gizmoCamera?: Camera;
    /**
     * Context menu for inspector tools such as "Post Process", "Nodes", "Materials", etc.
     */
    contextMenu?: Partial<Record<IInspectorContextMenuType, IInspectorContextMenuItem[]>>;
    /**
     * List of context menu items that should be completely overridden by custom items from the contextMenu property.
     */
    contextMenuOverride?: IInspectorContextMenuType[];
}
declare module "../scene" {
    interface Scene {
        /**
         * @internal
         * Backing field
         */
        _debugLayer: DebugLayer;
        /**
         * Gets the debug layer (aka Inspector) associated with the scene
         * @see https://doc.babylonjs.com/toolsAndResources/inspector
         */
        debugLayer: DebugLayer;
    }
}
/**
 * Enum of inspector action tab
 */
export declare enum DebugLayerTab {
    /**
     * Properties tag (default)
     */
    Properties = 0,
    /**
     * Debug tab
     */
    Debug = 1,
    /**
     * Statistics tab
     */
    Statistics = 2,
    /**
     * Tools tab
     */
    Tools = 3,
    /**
     * Settings tab
     */
    Settings = 4
}
/**
 * The debug layer (aka Inspector) is the go to tool in order to better understand
 * what is happening in your scene
 * @see https://doc.babylonjs.com/toolsAndResources/inspector
 */
export declare class DebugLayer {
    /**
     * Define the url to get the inspector script from.
     * By default it uses the babylonjs CDN.
     * @ignoreNaming
     */
    static InspectorURL: string;
    /**
     * The default configuration of the inspector
     */
    static Config: IInspectorOptions;
    private _scene;
    private BJSINSPECTOR;
    private _onPropertyChangedObservable?;
    /**
     * Observable triggered when a property is changed through the inspector.
     */
    get onPropertyChangedObservable(): any;
    private _onSelectionChangedObservable?;
    /**
     * Observable triggered when the selection is changed through the inspector.
     */
    get onSelectionChangedObservable(): any;
    /**
     * Instantiates a new debug layer.
     * The debug layer (aka Inspector) is the go to tool in order to better understand
     * what is happening in your scene
     * @see https://doc.babylonjs.com/toolsAndResources/inspector
     * @param scene Defines the scene to inspect
     */
    constructor(scene?: Scene);
    /**
     * Creates the inspector window.
     * @param config
     */
    private _createInspector;
    /**
     * Select a specific entity in the scene explorer and highlight a specific block in that entity property grid
     * @param entity defines the entity to select
     * @param lineContainerTitles defines the specific blocks to highlight (could be a string or an array of strings)
     */
    select(entity: any, lineContainerTitles?: string | string[]): void;
    /**
     * Get the inspector from bundle or global
     * @returns the inspector instance if found otherwise, null
     */
    private _getGlobalInspector;
    /**
     * Get if the inspector is visible or not.
     * @returns true if visible otherwise, false
     */
    isVisible(): boolean;
    /**
     * Hide the inspector and close its window.
     */
    hide(): void;
    /**
     * Update the scene in the inspector
     */
    setAsActiveScene(): void;
    /**
     * Launch the debugLayer.
     * @param config Define the configuration of the inspector
     * @returns a promise fulfilled when the debug layer is visible
     */
    show(config?: IInspectorOptions): Promise<DebugLayer>;
}

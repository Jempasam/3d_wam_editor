import { AbstractMesh } from "../../Meshes/abstractMesh.js";
import { Scene } from "../../scene.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { Vector3, Quaternion, TmpVectors } from "../../Maths/math.vector.js";
import { Observable } from "../../Misc/observable.js";
import { Camera } from "../../Cameras/camera.js";
/**
 * Base behavior for six degrees of freedom interactions in XR experiences.
 * Creates virtual meshes that are dragged around
 * And observables for position/rotation changes
 */
export class BaseSixDofDragBehavior {
    constructor() {
        this._attachedToElement = false;
        this._virtualMeshesInfo = {};
        this._tmpVector = new Vector3();
        this._tmpQuaternion = new Quaternion();
        this._dragType = {
            NONE: 0,
            DRAG: 1,
            DRAG_WITH_CONTROLLER: 2,
            NEAR_DRAG: 3,
        };
        this._moving = false;
        this._dragging = this._dragType.NONE;
        /**
         * The list of child meshes that can receive drag events
         * If `null`, all child meshes will receive drag event
         */
        this.draggableMeshes = null;
        /**
         * How much faster the object should move when the controller is moving towards it. This is useful to bring objects that are far away from the user to them faster. Set this to 0 to avoid any speed increase. (Default: 3)
         */
        this.zDragFactor = 3;
        /**
         * In case of multipointer interaction, all pointer ids currently active are stored here
         */
        this.currentDraggingPointerIds = [];
        /**
        /**
         * If camera controls should be detached during the drag
         */
        this.detachCameraControls = true;
        /**
         * Fires each time a drag starts
         */
        this.onDragStartObservable = new Observable();
        /**
         * Fires each time a drag happens
         */
        this.onDragObservable = new Observable();
        /**
         *  Fires each time a drag ends (eg. mouse release after drag)
         */
        this.onDragEndObservable = new Observable();
        /**
         * Should the behavior allow simultaneous pointers to interact with the owner node.
         */
        this.allowMultiPointer = true;
    }
    /**
     * The id of the pointer that is currently interacting with the behavior (-1 when no pointer is active)
     */
    get currentDraggingPointerId() {
        if (this.currentDraggingPointerIds[0] !== undefined) {
            return this.currentDraggingPointerIds[0];
        }
        return -1;
    }
    set currentDraggingPointerId(value) {
        this.currentDraggingPointerIds[0] = value;
    }
    /**
     * Get or set the currentDraggingPointerId
     * @deprecated Please use currentDraggingPointerId instead
     */
    get currentDraggingPointerID() {
        return this.currentDraggingPointerId;
    }
    set currentDraggingPointerID(currentDraggingPointerID) {
        this.currentDraggingPointerId = currentDraggingPointerID;
    }
    /**
     *  The name of the behavior
     */
    get name() {
        return "BaseSixDofDrag";
    }
    /**
     *  Returns true if the attached mesh is currently moving with this behavior
     */
    get isMoving() {
        return this._moving;
    }
    /**
     *  Initializes the behavior
     */
    init() { }
    /**
     * In the case of multiple active cameras, the cameraToUseForPointers should be used if set instead of active camera
     */
    get _pointerCamera() {
        if (this._scene.cameraToUseForPointers) {
            return this._scene.cameraToUseForPointers;
        }
        else {
            return this._scene.activeCamera;
        }
    }
    _createVirtualMeshInfo() {
        // Setup virtual meshes to be used for dragging without dirtying the existing scene
        const dragMesh = new AbstractMesh("", BaseSixDofDragBehavior._virtualScene);
        dragMesh.rotationQuaternion = new Quaternion();
        const originMesh = new AbstractMesh("", BaseSixDofDragBehavior._virtualScene);
        originMesh.rotationQuaternion = new Quaternion();
        const pivotMesh = new AbstractMesh("", BaseSixDofDragBehavior._virtualScene);
        pivotMesh.rotationQuaternion = new Quaternion();
        return {
            dragging: false,
            moving: false,
            dragMesh,
            originMesh,
            pivotMesh,
            startingPivotPosition: new Vector3(),
            startingPivotOrientation: new Quaternion(),
            startingPosition: new Vector3(),
            startingOrientation: new Quaternion(),
            lastOriginPosition: new Vector3(),
            lastDragPosition: new Vector3(),
        };
    }
    _resetVirtualMeshesPosition() {
        for (let i = 0; i < this.currentDraggingPointerIds.length; i++) {
            this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].pivotMesh.position.copyFrom(this._ownerNode.getAbsolutePivotPoint());
            this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].pivotMesh.rotationQuaternion.copyFrom(this._ownerNode.rotationQuaternion);
            this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].startingPivotPosition.copyFrom(this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].pivotMesh.position);
            this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].startingPivotOrientation.copyFrom(this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].pivotMesh.rotationQuaternion);
            this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].startingPosition.copyFrom(this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].dragMesh.position);
            this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].startingOrientation.copyFrom(this._virtualMeshesInfo[this.currentDraggingPointerIds[i]].dragMesh.rotationQuaternion);
        }
    }
    _pointerUpdate2D(ray, pointerId, zDragFactor) {
        if (this._pointerCamera && this._pointerCamera.cameraRigMode == Camera.RIG_MODE_NONE && !this._pointerCamera._isLeftCamera && !this._pointerCamera._isRightCamera) {
            ray.origin.copyFrom(this._pointerCamera.globalPosition);
            zDragFactor = 0;
        }
        const virtualMeshesInfo = this._virtualMeshesInfo[pointerId];
        // Calculate controller drag distance in controller space
        const originDragDifference = TmpVectors.Vector3[0];
        ray.origin.subtractToRef(virtualMeshesInfo.lastOriginPosition, originDragDifference);
        virtualMeshesInfo.lastOriginPosition.copyFrom(ray.origin);
        const localOriginDragDifference = -Vector3.Dot(originDragDifference, ray.direction);
        virtualMeshesInfo.originMesh.addChild(virtualMeshesInfo.dragMesh);
        virtualMeshesInfo.originMesh.addChild(virtualMeshesInfo.pivotMesh);
        this._applyZOffset(virtualMeshesInfo.dragMesh, localOriginDragDifference, zDragFactor);
        this._applyZOffset(virtualMeshesInfo.pivotMesh, localOriginDragDifference, zDragFactor);
        // Update the controller position
        virtualMeshesInfo.originMesh.position.copyFrom(ray.origin);
        const lookAt = TmpVectors.Vector3[0];
        ray.origin.addToRef(ray.direction, lookAt);
        virtualMeshesInfo.originMesh.lookAt(lookAt);
        virtualMeshesInfo.originMesh.removeChild(virtualMeshesInfo.dragMesh);
        virtualMeshesInfo.originMesh.removeChild(virtualMeshesInfo.pivotMesh);
    }
    _pointerUpdateXR(controllerAimTransform, controllerGripTransform, pointerId, zDragFactor) {
        const virtualMeshesInfo = this._virtualMeshesInfo[pointerId];
        virtualMeshesInfo.originMesh.position.copyFrom(controllerAimTransform.position);
        if (this._dragging === this._dragType.NEAR_DRAG && controllerGripTransform) {
            virtualMeshesInfo.originMesh.rotationQuaternion.copyFrom(controllerGripTransform.rotationQuaternion);
        }
        else {
            virtualMeshesInfo.originMesh.rotationQuaternion.copyFrom(controllerAimTransform.rotationQuaternion);
        }
        virtualMeshesInfo.pivotMesh.computeWorldMatrix(true);
        virtualMeshesInfo.dragMesh.computeWorldMatrix(true);
        // Z scaling logic
        if (zDragFactor !== 0) {
            // Camera.getForwardRay modifies TmpVectors.Vector[0-3], so cache it in advance
            const cameraForwardVec = TmpVectors.Vector3[0];
            const originDragDirection = TmpVectors.Vector3[1];
            cameraForwardVec.copyFrom(this._pointerCamera.getForwardRay().direction);
            virtualMeshesInfo.originMesh.position.subtractToRef(virtualMeshesInfo.lastOriginPosition, originDragDirection);
            virtualMeshesInfo.lastOriginPosition.copyFrom(virtualMeshesInfo.originMesh.position);
            const controllerDragDistance = originDragDirection.length();
            originDragDirection.normalize();
            const cameraToDrag = TmpVectors.Vector3[2];
            const controllerToDrag = TmpVectors.Vector3[3];
            virtualMeshesInfo.dragMesh.absolutePosition.subtractToRef(this._pointerCamera.globalPosition, cameraToDrag);
            virtualMeshesInfo.dragMesh.absolutePosition.subtractToRef(virtualMeshesInfo.originMesh.position, controllerToDrag);
            const controllerToDragDistance = controllerToDrag.length();
            cameraToDrag.normalize();
            controllerToDrag.normalize();
            const controllerDragScaling = Math.abs(Vector3.Dot(originDragDirection, controllerToDrag)) * Vector3.Dot(originDragDirection, cameraForwardVec);
            let zOffsetScaling = controllerDragScaling * zDragFactor * controllerDragDistance * controllerToDragDistance;
            // Prevent pulling the mesh through the controller
            const minDistanceFromControllerToDragMesh = 0.01;
            if (zOffsetScaling < 0 && minDistanceFromControllerToDragMesh - controllerToDragDistance > zOffsetScaling) {
                zOffsetScaling = Math.min(minDistanceFromControllerToDragMesh - controllerToDragDistance, 0);
            }
            controllerToDrag.scaleInPlace(zOffsetScaling);
            controllerToDrag.addToRef(virtualMeshesInfo.pivotMesh.absolutePosition, this._tmpVector);
            virtualMeshesInfo.pivotMesh.setAbsolutePosition(this._tmpVector);
            controllerToDrag.addToRef(virtualMeshesInfo.dragMesh.absolutePosition, this._tmpVector);
            virtualMeshesInfo.dragMesh.setAbsolutePosition(this._tmpVector);
        }
    }
    /**
     * Attaches the scale behavior the passed in mesh
     * @param ownerNode The mesh that will be scaled around once attached
     */
    attach(ownerNode) {
        this._ownerNode = ownerNode;
        this._scene = this._ownerNode.getScene();
        if (!BaseSixDofDragBehavior._virtualScene) {
            BaseSixDofDragBehavior._virtualScene = new Scene(this._scene.getEngine(), { virtual: true });
            BaseSixDofDragBehavior._virtualScene.detachControl();
        }
        const pickPredicate = (m) => {
            return this._ownerNode === m || (m.isDescendantOf(this._ownerNode) && (!this.draggableMeshes || this.draggableMeshes.indexOf(m) !== -1));
        };
        this._pointerObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            const pointerId = pointerInfo.event.pointerId;
            if (!this._virtualMeshesInfo[pointerId]) {
                this._virtualMeshesInfo[pointerId] = this._createVirtualMeshInfo();
            }
            const virtualMeshesInfo = this._virtualMeshesInfo[pointerId];
            const isXRPointer = pointerInfo.event.pointerType === "xr-near" || pointerInfo.event.pointerType === "xr";
            if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
                if (!virtualMeshesInfo.dragging &&
                    pointerInfo.pickInfo &&
                    pointerInfo.pickInfo.hit &&
                    pointerInfo.pickInfo.pickedMesh &&
                    pointerInfo.pickInfo.pickedPoint &&
                    pointerInfo.pickInfo.ray &&
                    (!isXRPointer || pointerInfo.pickInfo.aimTransform) &&
                    pickPredicate(pointerInfo.pickInfo.pickedMesh)) {
                    if ((!this.allowMultiPointer || isXRPointer) && this.currentDraggingPointerIds.length > 0) {
                        return;
                    }
                    if (this._pointerCamera &&
                        this._pointerCamera.cameraRigMode === Camera.RIG_MODE_NONE &&
                        !this._pointerCamera._isLeftCamera &&
                        !this._pointerCamera._isRightCamera) {
                        pointerInfo.pickInfo.ray.origin.copyFrom(this._pointerCamera.globalPosition);
                    }
                    this._ownerNode.computeWorldMatrix(true);
                    const virtualMeshesInfo = this._virtualMeshesInfo[pointerId];
                    if (isXRPointer) {
                        this._dragging = pointerInfo.pickInfo.originMesh ? this._dragType.NEAR_DRAG : this._dragType.DRAG_WITH_CONTROLLER;
                        virtualMeshesInfo.originMesh.position.copyFrom(pointerInfo.pickInfo.aimTransform.position);
                        if (this._dragging === this._dragType.NEAR_DRAG && pointerInfo.pickInfo.gripTransform) {
                            virtualMeshesInfo.originMesh.rotationQuaternion.copyFrom(pointerInfo.pickInfo.gripTransform.rotationQuaternion);
                        }
                        else {
                            virtualMeshesInfo.originMesh.rotationQuaternion.copyFrom(pointerInfo.pickInfo.aimTransform.rotationQuaternion);
                        }
                    }
                    else {
                        this._dragging = this._dragType.DRAG;
                        virtualMeshesInfo.originMesh.position.copyFrom(pointerInfo.pickInfo.ray.origin);
                    }
                    virtualMeshesInfo.lastOriginPosition.copyFrom(virtualMeshesInfo.originMesh.position);
                    virtualMeshesInfo.dragMesh.position.copyFrom(pointerInfo.pickInfo.pickedPoint);
                    virtualMeshesInfo.lastDragPosition.copyFrom(pointerInfo.pickInfo.pickedPoint);
                    virtualMeshesInfo.pivotMesh.position.copyFrom(this._ownerNode.getAbsolutePivotPoint());
                    virtualMeshesInfo.pivotMesh.rotationQuaternion.copyFrom(this._ownerNode.absoluteRotationQuaternion);
                    virtualMeshesInfo.startingPosition.copyFrom(virtualMeshesInfo.dragMesh.position);
                    virtualMeshesInfo.startingPivotPosition.copyFrom(virtualMeshesInfo.pivotMesh.position);
                    virtualMeshesInfo.startingOrientation.copyFrom(virtualMeshesInfo.dragMesh.rotationQuaternion);
                    virtualMeshesInfo.startingPivotOrientation.copyFrom(virtualMeshesInfo.pivotMesh.rotationQuaternion);
                    if (isXRPointer) {
                        virtualMeshesInfo.originMesh.addChild(virtualMeshesInfo.dragMesh);
                        virtualMeshesInfo.originMesh.addChild(virtualMeshesInfo.pivotMesh);
                    }
                    else {
                        virtualMeshesInfo.originMesh.lookAt(virtualMeshesInfo.dragMesh.position);
                    }
                    // Update state
                    virtualMeshesInfo.dragging = true;
                    if (this.currentDraggingPointerIds.indexOf(pointerId) === -1) {
                        this.currentDraggingPointerIds.push(pointerId);
                    }
                    // Detach camera controls
                    if (this.detachCameraControls && this._pointerCamera && !this._pointerCamera.leftCamera) {
                        if (this._pointerCamera.inputs && this._pointerCamera.inputs.attachedToElement) {
                            this._pointerCamera.detachControl();
                            this._attachedToElement = true;
                        }
                        else if (!this.allowMultiPointer || this.currentDraggingPointerIds.length === 0) {
                            this._attachedToElement = false;
                        }
                    }
                    this._targetDragStart(virtualMeshesInfo.pivotMesh.position, virtualMeshesInfo.pivotMesh.rotationQuaternion, pointerId);
                    this.onDragStartObservable.notifyObservers({ position: virtualMeshesInfo.pivotMesh.position });
                }
            }
            else if (pointerInfo.type == PointerEventTypes.POINTERUP || pointerInfo.type == PointerEventTypes.POINTERDOUBLETAP) {
                const registeredPointerIndex = this.currentDraggingPointerIds.indexOf(pointerId);
                // Update state
                virtualMeshesInfo.dragging = false;
                if (registeredPointerIndex !== -1) {
                    this.currentDraggingPointerIds.splice(registeredPointerIndex, 1);
                    if (this.currentDraggingPointerIds.length === 0) {
                        this._moving = false;
                        this._dragging = this._dragType.NONE;
                        // Reattach camera controls
                        if (this.detachCameraControls && this._attachedToElement && this._pointerCamera && !this._pointerCamera.leftCamera) {
                            this._reattachCameraControls();
                            this._attachedToElement = false;
                        }
                    }
                    virtualMeshesInfo.originMesh.removeChild(virtualMeshesInfo.dragMesh);
                    virtualMeshesInfo.originMesh.removeChild(virtualMeshesInfo.pivotMesh);
                    this._targetDragEnd(pointerId);
                    this.onDragEndObservable.notifyObservers({});
                }
            }
            else if (pointerInfo.type == PointerEventTypes.POINTERMOVE) {
                const registeredPointerIndex = this.currentDraggingPointerIds.indexOf(pointerId);
                if (registeredPointerIndex !== -1 && virtualMeshesInfo.dragging && pointerInfo.pickInfo && (pointerInfo.pickInfo.ray || pointerInfo.pickInfo.aimTransform)) {
                    let zDragFactor = this.zDragFactor;
                    // 2 pointer interaction should not have a z axis drag factor
                    // as well as near interaction
                    if (this.currentDraggingPointerIds.length > 1 || pointerInfo.pickInfo.originMesh) {
                        zDragFactor = 0;
                    }
                    this._ownerNode.computeWorldMatrix(true);
                    if (!isXRPointer) {
                        this._pointerUpdate2D(pointerInfo.pickInfo.ray, pointerId, zDragFactor);
                    }
                    else {
                        this._pointerUpdateXR(pointerInfo.pickInfo.aimTransform, pointerInfo.pickInfo.gripTransform, pointerId, zDragFactor);
                    }
                    // Get change in rotation
                    this._tmpQuaternion.copyFrom(virtualMeshesInfo.startingPivotOrientation);
                    this._tmpQuaternion.x = -this._tmpQuaternion.x;
                    this._tmpQuaternion.y = -this._tmpQuaternion.y;
                    this._tmpQuaternion.z = -this._tmpQuaternion.z;
                    virtualMeshesInfo.pivotMesh.absoluteRotationQuaternion.multiplyToRef(this._tmpQuaternion, this._tmpQuaternion);
                    virtualMeshesInfo.pivotMesh.absolutePosition.subtractToRef(virtualMeshesInfo.startingPivotPosition, this._tmpVector);
                    this.onDragObservable.notifyObservers({ delta: this._tmpVector, position: virtualMeshesInfo.pivotMesh.position, pickInfo: pointerInfo.pickInfo });
                    // Notify herited methods and observables
                    this._targetDrag(this._tmpVector, this._tmpQuaternion, pointerId);
                    virtualMeshesInfo.lastDragPosition.copyFrom(virtualMeshesInfo.dragMesh.absolutePosition);
                    this._moving = true;
                }
            }
        });
    }
    _applyZOffset(node, localOriginDragDifference, zDragFactor) {
        // Determine how much the controller moved to/away towards the dragged object and use this to move the object further when its further away
        node.position.z -= node.position.z < 1 ? localOriginDragDifference * zDragFactor : localOriginDragDifference * zDragFactor * node.position.z;
        if (node.position.z < 0) {
            node.position.z = 0;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _targetDragStart(worldPosition, worldRotation, pointerId) {
        // Herited classes can override that
    }
    _targetDrag(worldDeltaPosition, worldDeltaRotation, pointerId) {
        // Herited classes can override that
    }
    _targetDragEnd(pointerId) {
        // Herited classes can override that
    }
    _reattachCameraControls() {
        if (this._pointerCamera) {
            // If the camera is an ArcRotateCamera, preserve the settings from the camera
            // when reattaching control
            if (this._pointerCamera.getClassName() === "ArcRotateCamera") {
                const arcRotateCamera = this._pointerCamera;
                arcRotateCamera.attachControl(arcRotateCamera.inputs ? arcRotateCamera.inputs.noPreventDefault : true, arcRotateCamera._useCtrlForPanning, arcRotateCamera._panningMouseButton);
            }
            else {
                // preserve the settings from the camera when reattaching control
                this._pointerCamera.attachControl(this._pointerCamera.inputs ? this._pointerCamera.inputs.noPreventDefault : true);
            }
        }
    }
    /**
     * Detaches the behavior from the mesh
     */
    detach() {
        if (this._scene) {
            if (this.detachCameraControls && this._attachedToElement && this._pointerCamera && !this._pointerCamera.leftCamera) {
                this._reattachCameraControls();
                this._attachedToElement = false;
            }
            this._scene.onPointerObservable.remove(this._pointerObserver);
        }
        for (const pointerId in this._virtualMeshesInfo) {
            this._virtualMeshesInfo[pointerId].originMesh.dispose();
            this._virtualMeshesInfo[pointerId].dragMesh.dispose();
        }
        this.onDragEndObservable.clear();
        this.onDragObservable.clear();
        this.onDragStartObservable.clear();
    }
}
//# sourceMappingURL=baseSixDofDragBehavior.js.map
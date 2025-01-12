import type { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock";
import { FlowGraphConnection } from "./flowGraphConnection";
import type { FlowGraphContext } from "./flowGraphContext";
/**
 * @experimental
 * Represents a connection point for a signal.
 * When an output point is activated, it will activate the connected input point.
 * When an input point is activated, it will execute the block it belongs to.
 */
export declare class FlowGraphSignalConnection extends FlowGraphConnection<FlowGraphExecutionBlock, FlowGraphSignalConnection> {
    /**
     * @internal
     * A signal input can be connected to more than one signal output,
     * but a signal output can only connect to one signal input
     * @returns true if the connection is singular
     */
    _isSingularConnection(): boolean;
    /**
     * @internal
     */
    _activateSignal(context: FlowGraphContext): void;
}

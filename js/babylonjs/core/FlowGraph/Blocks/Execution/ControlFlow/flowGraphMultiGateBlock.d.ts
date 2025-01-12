import type { FlowGraphContext } from "../../../flowGraphContext";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock";
import type { FlowGraphSignalConnection } from "../../../flowGraphSignalConnection";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock";
/**
 * @experimental
 * Configuration for the multi gate block.
 */
export interface IFlowGraphMultiGateBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The number of output flows.
     */
    numberOutputFlows: number;
    /**
     * If the block should pick a random output flow from the ones that haven't been executed. Default to false.
     */
    isRandom?: boolean;
    /**
     * If the block should loop back to the first output flow after executing the last one. Default to false.
     */
    loop?: boolean;
    /**
     * The index of the output flow to start with. Default to 0.
     */
    startIndex?: number;
}
/**
 * @experimental
 * A block that has an input flow and routes it to any potential output flows, randomly or sequentially
 * @see https://docs.google.com/document/d/1MT7gL-IEn_PUw-4XGBazMxsyqsxqgAVGYcNeC4Cj_9Q/edit#heading=h.i2sn85fbjo60
 */
export declare class FlowGraphMultiGateBlock extends FlowGraphExecutionBlock {
    /**
     * the configuration of the block
     */
    config: IFlowGraphMultiGateBlockConfiguration;
    /**
     * Input connection: Resets the gate.
     */
    readonly reset: FlowGraphSignalConnection;
    /**
     * Output connections: The output flows.
     */
    outFlows: FlowGraphSignalConnection[];
    /**
     * Output connection: The index of the current output flow.
     */
    readonly currentIndex: FlowGraphDataConnection<number>;
    private _cachedUnusedIndexes;
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphMultiGateBlockConfiguration);
    private _getUnusedIndexes;
    private _getNextOutput;
    _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
    /**
     * Serializes the block.
     * @param serializationObject the object to serialize to.
     */
    serialize(serializationObject?: any): void;
}

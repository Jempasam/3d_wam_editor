/**
 * Class containing a set of static utilities functions for deep copy.
 */
export declare class DeepCopier {
    /**
     * Tries to copy an object by duplicating every property
     * @param source defines the source object
     * @param destination defines the target object
     * @param doNotCopyList defines a list of properties to avoid
     * @param mustCopyList defines a list of properties to copy (even if they start with _)
     * @param shallowCopyValues defines wether properties referencing objects (none cloneable) must be shallow copied (false by default)
     * @remarks shallowCopyValues will not instantite the copied values which makes it only usable for "JSON objects"
     */
    static DeepCopy(source: any, destination: any, doNotCopyList?: string[], mustCopyList?: string[], shallowCopyValues?: boolean): void;
}

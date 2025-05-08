import { StandardMaterial } from "@babylonjs/core";
import { AsyncShareMapDataType, ShareMapDataType } from "./ShareMap.ts";
import { createFieldFactories, FieldValueFactory } from "./value/FieldValue.ts";


export const ControlShared = {

    MATERIAL: {
        create(env){ return new StandardMaterial("3dmaterial", env.host.babylonjs!!.root.getScene()) },
        dispose(value){ value.dispose() },
    } as ShareMapDataType<StandardMaterial>,

    FIELDS: {
        create(env){ return createFieldFactories(env.host.wam) },
        dispose(_){ },
    } as AsyncShareMapDataType<Record<string,FieldValueFactory>>,

}
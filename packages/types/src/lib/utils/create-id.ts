import { HasId, HasPartialId } from "../capabilities/index.js";
import { v4 as uuidv4 } from "uuid";
import { ID } from "../primitives/index.js";

export const createID = (): ID => uuidv4()

    , createIdFor = <
        T extends HasPartialId
    >(
        o = {} as T
    ): Omit<T, "id"> & HasId => ({
        ...o
        , id: o.id ?? createID()
    })

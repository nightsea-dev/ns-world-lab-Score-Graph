import {
    IsEmptyString,
    KeyOf
    , KeysWithObjectValuesWithProperties,
    KeysWithValue,
    OmitKeysWithValue,
    UnionToIntersection
} from "../../ts/index.js"


// ======================================== event
export type _BaseEventKind = string
export type _BaseEvent = Record<string, any>

export type HasEventKind<
    Sx extends _BaseEventKind
> =
    & {
        __eventKind: Sx
    }

export type OmitEventKind<
    Ev extends _BaseEvent
> = Omit<Ev, KeyOf<HasEventKind<any>>>

/**
 * * [replaces] previous [__eventKind]
 */
export type EventWithKind<
    Ev extends _BaseEvent
    , Sx extends _BaseEventKind
> =
    & OmitEventKind<Ev>
    & HasEventKind<Sx>



// ======================================== event-handler

export type _HandlerKey<
    Sx extends _BaseEventKind
> = `on${Capitalize<Sx>}`

export type _Handler<
    Ev extends _BaseEvent = _BaseEvent
> = Ev extends object
    ? (
        KeyOf<Ev> extends never
        ? () => void
        : (ev: Ev) => void
    )
    : () => void

export type HasEventHandler<
    Sx extends _BaseEventKind
    , Ev extends _BaseEvent
> =
    & {
        [k in _HandlerKey<Sx>]:
        _Handler<Ev>
    }

export type HasEventWithKindHandler<
    Sx extends _BaseEventKind
    , Ev extends _BaseEvent
> =
    & {
        [k in _HandlerKey<Sx>]:
        _Handler<
            EventWithKind<Ev, k>
        >
    }


// ======================================== event-handler-map

type __BaseEventsMap = Record<string, _BaseEvent>
type _AddKindToMapEvents<
    EvMap extends __BaseEventsMap
> = {
        [k in KeyOf<EvMap>]: EventWithKind<EvMap[k], k>
    }
type _OmitKindFromMapEvents<
    EvMap extends __BaseEventsMap
> = {
        [k in KeyOf<EvMap>]: OmitEventKind<EvMap[k]>
    }


export type EventHandlerMap<
    EvMap extends __BaseEventsMap
> = {
        [k in KeyOf<EvMap> as _HandlerKey<k>]:
        _Handler<EvMap[k]>
    }

export type EventWKindHandlerMap<
    EvMap extends __BaseEventsMap
> = {
        [k in KeyOf<EvMap> as _HandlerKey<k>]:
        _Handler<
            EventWithKind<EvMap[k], k>
        >
    }


// ======================================== info

type __EventKindWithProperties<
    EvMap extends __BaseEventsMap
> = KeysWithObjectValuesWithProperties<EvMap>


type __EventsUnionFromMap<
    EvMap extends __BaseEventsMap
> =
    & UnionToIntersection<
        {
            [k in __EventKindWithProperties<EvMap>]
            : OmitEventKind<EvMap[k]>
        }[__EventKindWithProperties<EvMap>]
    >

export type EventHandlersFromMap<
    EvMap extends __BaseEventsMap
> =
    & {
        [k in KeyOf<EvMap> as _HandlerKey<k>]:
        & _Handler<EvMap[k]>
    }

export {
    type EventHandlersFromMap as HasEventHandlersFromMap
}


export type EventMapInfo<
    EvMap extends __BaseEventsMap
> =
    & {
        _sourceEventsMap: _OmitKindFromMapEvents<EvMap>
        EventKind: KeyOf<EvMap>
        Events: {
            [k in KeyOf<EvMap>]:
            & EvMap[k]
        }
        EventsUnion: __EventsUnionFromMap<EvMap>
        Handlers: EventHandlersFromMap<EvMap>
        // {
        //     [k in KeyOf<EvMap> as _HandlerKey<k>]:
        //     & _Handler<EvMap[k]>
        // }
        HandlersByEventKind: {
            [k in KeyOf<EvMap>]:
            & _Handler<EvMap[k]>

        }
    }

export type EventWKindMapInfo<
    EvMap extends __BaseEventsMap
> = EventMapInfo<
    _AddKindToMapEvents<EvMap>
>






// ========================================
// {

//     type EvMap = {
//         click: {
//             a: number
//             b: string
//         }
//         select: {
//             c: boolean
//             d: Date
//         }
//     }

//     type Map = EventHandlerMap<EvMap>


//     type RRR = EventOf<Map["onClick"]>

// }



export type OmitHandlers<
    T extends Record<string, any>
> = {
        [k in OmitKeysWithValue<T, (...args: any) => any>]: T[k]
    }
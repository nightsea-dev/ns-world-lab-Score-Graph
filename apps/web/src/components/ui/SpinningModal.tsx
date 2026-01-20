import { Modal, Loader } from "rsuite"

export type SpinningModalProps =
    & {
        open: boolean
        , title?: string
        , message?: string
        , onClose?: () => void
    }

export const SpinningModal = ({
    open
    , title = "Working"
    , message = "Please wait"
    , onClose
}: SpinningModalProps
) => {

    return (
        <Modal
            open={open}
            onClose={onClose}
            backdrop="static"
            keyboard={false}
            size="xs"
        >
            <Modal.Header>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="flex items-center gap-3">
                    <Loader size="md" />
                    <div className="text-sm text-slate-600">
                        {message}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

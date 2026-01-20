import { Header } from "rsuite"




export const Header1 = ({

}:{
    
}) => {
    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                background: "var(--rs-gray-100)",
                borderBottom: "1px solid var(--rs-border-primary)",
            }}
        >
            {/* left slot */}
            <strong style={{ fontSize: 16 }}>
                Topics
            </strong>

            {/* right slot (actions later) */}
            <div />
        </Header>
    )
}
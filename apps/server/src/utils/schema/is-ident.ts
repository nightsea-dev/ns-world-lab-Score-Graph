
const IDENT_RX = /^[A-Za-z_][A-Za-z0-9_]*$/
export const isIdent = (schemaName: string) => IDENT_RX.test(schemaName)
export const generateInviteCode = async () => {
    const { nanoid } = await import('nanoid')
    return nanoid(6) 
}
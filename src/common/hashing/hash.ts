import * as bcrypt from 'bcrypt';


export async function hashingData(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}
    
export async function compareData(data: string, hashedData: string){
    return bcrypt.compare(data, hashedData);
}

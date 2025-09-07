export function isExplicitFalse(value: any): value is false {
  return value === false;
}

export function validEmail(email:string)
{
const isGmail = (email: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
return isGmail;
}
 
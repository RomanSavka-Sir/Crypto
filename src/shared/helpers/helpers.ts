import { randomBytes } from "crypto";

export const under18 = function (date: string): boolean {
    const now = new Date();
    const month = now.getMonth();
    now.setFullYear(now.getFullYear() - 18);
    if (month != now.getMonth()) now.setDate(0);
    return now > new Date(date);
};

export const randomCode = function (): string {
    let code = randomBytes(64).readBigUInt64LE().toString().substring(0, 6);
  
    while (code.length < 6) {
      code = '0' + code;
    }
    return code;
  };


export class User {
  public id: number = 0;
  public username: string = "";
  public password: string | undefined;
  public email: string = "";
  public otp: string = "";
  public otpGeneratedTime: Date | undefined;

  getEmail() {
    return this.email;
  }
}


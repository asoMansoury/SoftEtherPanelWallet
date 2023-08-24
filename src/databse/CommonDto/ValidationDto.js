export class ValidationDto{
    constructor(isValid,errorMsg){
        this.isValid = isValid;
        this.errorMsg = errorMsg;
    }
}
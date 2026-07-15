const validator=require("validator");

const validate=(data)=>{
    
    const mandatroyField=['firstName','emailId','password'];

    const IsAllowed=mandatroyField.every((k)=>{
        return Object.keys(data).includes(k);
    })

    if(!IsAllowed)throw new Error("Field Missing");

    if(!validator.isEmail(data.emailId))throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))throw new Error("Weak Password"); 
}

module.exports=validate;
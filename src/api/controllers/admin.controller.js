require('dotenv').config();

module.exports={
  getClasses: (req,res)=>{
    
  },

  getAccounts: async (req,res)=>{
    const accounts = await Account.find({});
    console.log(accounts); 
  }
}
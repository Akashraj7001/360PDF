const router=require('express').Router();
const Data=require('../models/userInfo');

router.get('/user', async (req, res) => {
    try {
        const data = await Data.aggregate([
            {
                $group: {
                    _id: "$empid",
                    empname: { $first: "$empname" },
                    role: { $push: "$role" },
                    value:{$push: "$value"},

                }
            }
        ]);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'SOMETHING WENT WRONG',
            status: 0,
        });
    }
})
























// router.get('/user',async(req,res)=>{
//     try{
//            const data=await Data.find().distinct("empid");
//            console.log(data);
//            res.send(data);
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send({
//           message: 'SOMETHING WENT WRONG',
//           status: 0,
//         });
//       }
// })









module.exports=router;


module.exports = {
    getAddressByID: async (req, res, next) => {
        try {

            let id = req.params.id
            let address = await req.addressUC.getAddressByID(id)
            if (address == null) {
                return res.status(404).json({
                    message: "failed",
                    data: null
                });
            } res.status(200).json({
                status: "OK",
                message: "success",
                data: address

            });
        } catch (error) {
            next(error)
        };
    },
    // todo get all address
    getAllAddress: async (req, res, next) => {
        try {
            //your code here
            let address = await req.addressUC.getAllAddress()
            if (address == null) {
                return res.status(404).json({
                    message: "failed",
                    data: null
                });
            } res.status(200).json({
                status: "OK",
                message: "success",
                data: address

            });
        } catch (error) {
            next(error)
        };
    },
    // todo create address
    addAddress: async (req, res) => {
        let address = {
            province: req.body.province,
            city: req.body.city,
            postal_code: req.body.postal_code,
            detail: req.body.detail,
            user_id: req.body.user_id
        }

        let newAddress = await req.addressUC.addAddress(address)
        if (newAddress == null) {
            return res.status(400).json(null)
          }
          res.status(200).send({
            status: 'ok',
            message: 'success',
            data: address,
          })
    }
    // addres field
    // province: "abc",
    // city: "abc",
    // postal_code: "41232",
    // detail: "jl. abc kec abc",
    // user_id : 2


    // todo update address
    // todo delete address

}
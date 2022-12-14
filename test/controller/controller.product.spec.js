const productController = require('../../controller/product')
const resData = require('../../helper/response')

let mockProductUC = {
    getProductByID: jest.fn().mockReturnValue(null),
    updateProduct: jest.fn().mockReturnValue(null),
    getAllProducts: jest.fn().mockReturnValue(null),
    addProduct: jest.fn().mockReturnValue(null),
    deleteProduct: jest.fn().mockReturnValue(null),
}

const mockRequest = (body={}, query={}, params={}, user={}, useCases={}) => {
    return {
        body: body,
        query: query,
        params: params,
        user: user,
        ...useCases
    }
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)

    return res
}

const next = () => jest.fn().mockReturnValue(
    {
        status: 500, 
        json:{
            status: 'failed',
            message: 'internal server error',
        }
    }
);

describe('Test Product', () => {
    describe('get all products', () => {

        const product = [
            {
                id: 1,
                name: 'Iphone 13 Pro',
                description: 'Smartphone dari apple',
                category_id: 1,
                sold: 10,
                price: 25000000,
                stock: 10,
                image: null,
                createdAt: "12-09-2022 23:30:00",
                updatedAt: "12-09-2022 23:30:00",       
            }
        ]
        
        test('should status 200 and data in array', async () => {
            mockProductUC.getAllProducts = jest.fn().mockReturnValue(
                {isSuccess: true, reason:null, data:product}
            )
            let req = mockRequest({},{},{},{},{ productUC:mockProductUC })
            let res = mockResponse()

            await productController.getAllProducts(req, res, next)

            expect(mockProductUC.getAllProducts).toHaveBeenCalled()
            expect(res.status).toBeCalledWith(200)
            expect(res.json).toBeCalledWith(resData.success(product))
        })   

        test('should status 200 and data empty', async() => {
            mockProductUC.getAllProducts = jest.fn().mockReturnValue(
                {isSuccess: true, reason:null, data:[]}
            )
            let req = mockRequest({},{},{},{},{ productUC: mockProductUC })
            let res = mockResponse()
            
            await productController.getAllProducts(req, res, next)

            expect(mockProductUC.getAllProducts).toHaveBeenCalled()
            expect(res.status).toBeCalledWith(200)
            expect(res.json).toBeCalledWith(resData.success([]))
        })
        
          test("should status is 500 and message is 'internal server error'", async () => {
                mockProductUC.getAllProducts = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

               let req = mockRequest({},{},{},{},{ productUC: mockProductUC })
                let res = mockResponse();
                let serverError = next();

                await productController.getAllProducts(req, res, next)
                
                expect(serverError().status).toEqual(500);
                expect(serverError().json.message).toEqual('internal server error');
            });

    })

    describe('get product by Id', () => {

        const product = 
            {
                id: 1,
                name: 'Iphone 13 Pro',
                description: 'Smartphone dari apple',
                category_id: 1,
                sold: 10,
                price: 25000000,
                stock: 10,
                image: null,
                createdAt: "12-09-2022 23:30:00",
                updatedAt: "12-09-2022 23:30:00",       
            }
    

        test('should status 200 and data is object', async () => {
            mockProductUC.getProductById = jest.fn().mockReturnValue(
                {isSuccess: true, reason: null, data: product})
        
            let req = mockRequest({},{},{id:1},{},{ productUC: mockProductUC })
            let res = mockResponse()

            await productController.getProductById(req, res, next)
            

            expect(mockProductUC.getProductById).toHaveBeenCalled()
            expect(res.status).toBeCalledWith(200)
            expect(res.json).toBeCalledWith(resData.success(product))
        })
    

        test('should status 404 and message is product not found', async () => {
            mockProductUC.getProductById = jest.fn().mockReturnValue(
                {isSuccess: false, reason: 'product not found', data:null})
        
            let req = mockRequest({},{},{id:2},{},{ productUC: mockProductUC})
            let res = mockResponse()

            await productController.getProductById(req, res, next)

            expect(res.status).toBeCalledWith(404)
            expect(res.json).toBeCalledWith(resData.failed('product not found', null))
        })

          test("should status is 500 and message is 'internal server error'", async () => {
                mockProductUC.getProductById = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                let req = mockRequest({},{},{id:2},{},{ productUC: mockProductUC})
                let res = mockResponse();
                let serverError = next();

                await productController.getProductById(req, res, next)
                
                expect(serverError().status).toEqual(500);
                expect(serverError().json.message).toEqual('internal server error');
            });
    })


    describe('add product', () => {

        const product = 
            {
                id: 1,
                name: 'Iphone 13 Pro',
                description: 'Smartphone dari apple',
                category_id: 1,
                sold: 10,
                price: 25000000,
                stock: 10,
                image: null,
                createdAt: "12-09-2022 23:30:00",
                updatedAt: "12-09-2022 23:30:00",       
            }
        
        let productBody = 
            {
                name: "Iphone 13 Pro",
                description: "Smartphone dari apple",
                category_id: 1,
                price: 25000000,
                stock: 10,
            }

            
        test('should status 200 and data is object', async () => {
            mockProductUC.addProduct = jest.fn().mockReturnValue(
                {isSuccess: true, reason:null, data:product})
            
                let req = mockRequest(productBody,{},{},{},{ productUC: mockProductUC })
                let res = mockResponse()
    
                await productController.addProduct(req, res, next)
                
    
                expect(mockProductUC.addProduct).toHaveBeenCalled()
                expect(res.status).toBeCalledWith(201)
                expect(res.json).toBeCalledWith(resData.success(product))
            })
    
        test('should status 404 and message is product not found', async () => {
            mockProductUC.addProduct = jest.fn().mockReturnValue(
                {isSuccess: false, reason: 'failed to add, category not found', data:null})
            
                let req = mockRequest(productBody,{},{},{},{ productUC: mockProductUC})
                let res = mockResponse()
        
                await productController.addProduct(req, res, next)
        
                expect(res.status).toBeCalledWith(404)
                expect(res.json).toBeCalledWith(resData.failed('failed to add, category not found', null))
        })

          test("should status is 500 and message is 'internal server error'", async () => {
                mockProductUC.addProduct  = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                let req = mockRequest(productBody,{},{},{},{ productUC: mockProductUC})
                let res = mockResponse();
                let serverError = next();

                await productController.addProduct(req, res, next)
                
                expect(serverError().status).toEqual(500);
                expect(serverError().json.message).toEqual('internal server error');
            });

    })

    describe('update product', () => {

        
        const product = 
            {
                id: 1,
                name: 'Iphone 13 Pro',
                description: 'Smartphone dari apple',
                category_id: 1,
                sold: 10,
                price: 25000000,
                stock: 10,
                image: null,
                createdAt: "12-09-2022 23:30:00",
                updatedAt: "12-09-2022 23:30:00",       
            }

        
        test('should status 200 and data object', async () => {
            mockProductUC.updateProduct = jest.fn().mockReturnValue(
                {isSuccess: true, reason: null, data: product})
            
                let req = mockRequest({},{},{id:1},{},{ productUC: mockProductUC})
                let res = mockResponse()
    
                await productController.updateProduct(req, res, next)
                
    
                expect(mockProductUC.updateProduct).toHaveBeenCalled()
                expect(res.status).toBeCalledWith(200)
                expect(res.json).toBeCalledWith(resData.success())
            })
    
        test('should status 404 and message is product not found', async () => {
            mockProductUC.updateProduct = jest.fn().mockReturnValue(
                {isSuccess: false, reason: 'product not found', data:null})
            
                let req = mockRequest({},{},{id:2},{},{ productUC: mockProductUC})
                let res = mockResponse()
        
                await productController.updateProduct(req, res, next)
        
                expect(res.status).toBeCalledWith(404)
                expect(res.json).toBeCalledWith(resData.failed('product not found', null))
        })

           test("should status is 500 and message is 'internal server error'", async () => {
                mockProductUC.updateProduct  = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                let req = mockRequest({},{},{id:2},{},{ productUC: mockProductUC})
                let res = mockResponse();
                let serverError = next();

                await productController.updateProduct(req, res, next)
                
                expect(serverError().status).toEqual(500);
                expect(serverError().json.message).toEqual('internal server error');
            });
        
    })

    describe('delete product', () => {

        const product = 
            {
                id: 1,
                name: 'Iphone 13 Pro',
                description: 'Smartphone dari apple',
                category_id: 1,
                sold: 10,
                price: 25000000,
                stock: 10,
                image: null,
                createdAt: "12-09-2022 23:30:00",
                updatedAt: "12-09-2022 23:30:00",       
            }
    

        test('should status 200 and data is object', async () => {
            mockProductUC.deleteProduct = jest.fn().mockReturnValue(
                {isSuccess: true, reason: null, data: product})
        
            let req = mockRequest({},{},{id:1},{},{ productUC: mockProductUC })
            let res = mockResponse()

            await productController.deleteProduct(req, res, next)
            

            expect(mockProductUC.deleteProduct).toHaveBeenCalled()
            expect(res.status).toBeCalledWith(200)
            expect(res.json).toBeCalledWith(resData.success())
        })
    

        test('should status 404 and message is product not found', async () => {
            mockProductUC.deleteProduct = jest.fn().mockReturnValue(
                {isSuccess: false, reason: 'product not found', data:null})
        
            let req = mockRequest({},{},{id:2},{},{ productUC: mockProductUC})
            let res = mockResponse()

            await productController.deleteProduct(req, res, next)

            expect(res.status).toBeCalledWith(404)
            expect(res.json).toBeCalledWith(resData.failed('product not found', null))
        })

          test("should status is 500 and message is 'internal server error'", async () => {
             mockProductUC.deleteProduct  = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            let req = mockRequest({},{},{id:2},{},{ productUC: mockProductUC})
            let res = mockResponse();
            let serverError = next();

            await productController.deleteProduct(req, res, next)
            
            expect(serverError().status).toEqual(500);
            expect(serverError().json.message).toEqual('internal server error');
        });
        
    })
})
const CategoryUsecase = require("../../usecase/category")
const mockCategoryRepo = require("../mock/repository.category.mock");
const mockProductRepo = require("../mock/repository.product.mock");

let categoryValues = {};
let categoryUC = null

describe("category", () => {

  beforeEach(() => {

        categoryValues = {
          returnGetCategoryByID: true,
          returnUpdateCategory: true,
          returnGetAllCategory: true,
          returnAddCategory: true,
          returnDeleteCategory: true,
          returnGetDefaultCategory: true
        }

        productValues = {
          returnGetProductByCategoryId : true
        }

        categoryUC = new CategoryUsecase(mockCategoryRepo(categoryValues), mockProductRepo(productValues))
    })
    describe("get all category", () => {
        test("seharusnya isSuccess = true dan data dalam array", async () => {
            let res = await categoryUC.getAllCategory()

            expect(res.isSuccess).toBeTruthy()
        })

        test("seharusnya isSuccess = true dan data = []", async () => {
            categoryValues.returnGetAllCategory = [];
            categoryUC = new CategoryUsecase(mockCategoryRepo(categoryValues), mockProductRepo(productValues))
      
            let res = await categoryUC.getAllCategory();
      
            expect(res.isSuccess).toBeTruthy();
            expect(res.data).toEqual([]);
          });
        });
      
        describe("update category", () => {
          test("seharusnya isSuccess  = true", async () => {
            let res = await categoryUC.updateCategory(1, { name: "test" });
      
            expect(res.isSuccess).toBeTruthy();
          });
      
          test("seharusnya isSuccess  = false dan reason = category not found", async () => {
            categoryValues.returnGetCategoryByID = null;
            categoryUC = new CategoryUsecase(mockCategoryRepo(categoryValues), mockProductRepo(productValues))
            let res = await categoryUC.updateCategory(1, { name: "test" });
      
            expect(res.isSuccess).toBeFalsy();
            expect(res.reason).toEqual("category not found");
          });
        });
        describe("get category by Id",() => {
          test("seharusnya isSuccess  = true dan data dalam object", async () => {
            let res = await categoryUC.getCategoryByID(1);
      
            expect(res.isSuccess).toBeTruthy();
            expect(typeof res.data === "object").toBeTruthy();
          });
      
          test("seharusnya isSuccess = false dan data = null", async () => {
            categoryValues.returnGetCategoryByID = null;
            categoryUC = new CategoryUsecase(mockCategoryRepo(categoryValues), mockProductRepo(productValues))
      
            let res = await categoryUC.getCategoryByID();
      
            expect(res.isSuccess).toBeFalsy();
            expect(res.data).toEqual(null);
          });
        });
      
        describe("add category", () => {
          test("should isSuccess  = true and data is object", async () => {
            let res = await categoryUC.addCategory({
                id: "1",
                name: "celana",
            });
      
            expect(res.isSuccess).toBeTruthy();
            expect(typeof res.data === "object").toBeTruthy();
          });
      
          test("should isSuccess = false and data = null", async () => {
            categoryValues.returnAddCategory = null
            categoryUC = new CategoryUsecase(mockCategoryRepo(categoryValues), mockProductRepo(productValues))
      
            let res = await categoryUC.addCategory({
                id: "1",
                name: "celana",
            });
      
            expect(res.isSuccess).toBeFalsy();
            expect(res.reason).toEqual("failed add category");
          });
        });
      
        describe("deleteCategory", () => {
          test("should isSuccess = true", async () => {
            let res = await categoryUC.deleteCategory(1);
      
            expect(res.isSuccess).toBeTruthy();
          });
      
          test("should isSuccess = false and reason = category not found", async () => {
            categoryValues.returnGetCategoryByID = null
            categoryUC = new CategoryUsecase(mockCategoryRepo(categoryValues), mockProductRepo(productValues))
            let res = await categoryUC.deleteCategory();
      
            expect(res.isSuccess).toBeFalsy();
            expect(res.reason).toEqual("category not found");
          });
        });
      });
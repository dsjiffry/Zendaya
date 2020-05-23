package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import com.coconutcoders.zendaya.zendayaBackend.model.ProductCategory;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductCategoryRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ProductCategoryController {
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductCategoryRepo productCategoryRepo;

    /**
     * Create a new Product Category to Database
     * POST to http://localhost:8080/createCategory
     *
     * @param payload should contain JSON key-value pairs with key(s): "categoryName"
     * @return CONFLICT if a Category with same name is already in DB, else OK
     */
    @RequestMapping(value = "/createCategory", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity createCategory(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("categoryName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String categoryName = payload.get("categoryName");

        ProductCategory productCategory = productCategoryRepo.findByNameIgnoreCase(categoryName);
        if (productCategory != null) {
            return new ResponseEntity<>("Category already exists", HttpStatus.CONFLICT);
        }
        productCategory = new ProductCategory(categoryName);
        productCategoryRepo.save(productCategory);

        return new ResponseEntity<>(categoryName + " Added to Database", HttpStatus.OK);
    }

    /**
     * add a product to a Category
     * POST to http://localhost:8080/addToCategory
     *
     * @param payload should contain JSON key-value pairs with key(s): "categoryName", "productName"
     * @return NOT_FOUND if the category not found, else OK
     */
    @RequestMapping(value = "/addToCategory", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addToCategory(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("categoryName") || !payload.containsKey("productName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String categoryName = payload.get("categoryName");
        final String productName = payload.get("productName");

        ProductCategory productCategory = productCategoryRepo.findByNameIgnoreCase(categoryName);
        if (productCategory == null) {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }

        if (productRepo.findByNameIgnoreCase(productName) == null) {
            return new ResponseEntity<>("invalid product", HttpStatus.NOT_FOUND);
        }
        productCategory.addProductToCategory(productName);
        productCategoryRepo.save(productCategory);

        return new ResponseEntity<>(productName + " Added to " + categoryName, HttpStatus.OK);
    }

    /**
     * remove a product to a Category
     * POST to http://localhost:8080/removeFromCategory
     *
     * @param payload should contain JSON key-value pairs with key(s): "categoryName", "productName"
     * @return NOT_FOUND if the category is not found, else OK
     */
    @RequestMapping(value = "/removeFromCategory", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeFromCategory(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("categoryName") || !payload.containsKey("productName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String categoryName = payload.get("categoryName");
        final String productName = payload.get("productName");

        ProductCategory productCategory = productCategoryRepo.findByNameIgnoreCase(categoryName);
        if (productCategory == null) {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }

        if (productRepo.findByNameIgnoreCase(productName) == null) {
            return new ResponseEntity<>("invalid product", HttpStatus.NOT_FOUND);
        }
        productCategory.removeProductFromCategory(productName);
        productCategoryRepo.save(productCategory);

        return new ResponseEntity<>(productName + " removed form " + categoryName, HttpStatus.OK);
    }

    /**
     * delete a Category
     * POST to http://localhost:8080/deleteCategory
     *
     * @param payload should contain JSON key-value pairs with key(s): "categoryName"
     * @return NOT_FOUND if the category is not found, else OK
     */
    @RequestMapping(value = "/deleteCategory", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity deleteCategory(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("categoryName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String categoryName = payload.get("categoryName");

        ProductCategory productCategory = productCategoryRepo.findByNameIgnoreCase(categoryName);
        if (productCategory == null) {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }

        productCategoryRepo.delete(productCategory);

        return new ResponseEntity<>(categoryName + " deleted", HttpStatus.OK);
    }

    /**
     * get All categories
     * POST to http://localhost:8080/getAllCategories
     *
     * @return NOT_FOUND if the category is not found, else OK
     */
    @RequestMapping(value = "/getAllCategories", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getAllCategories() {
        List<ProductCategory> productCategories = productCategoryRepo.findAll();
        if (productCategories == null || productCategories.isEmpty()) {
            return new ResponseEntity<>("no categories found", HttpStatus.NOT_FOUND);
        }

        ArrayList<String> response = new ArrayList<>();
        for (ProductCategory productCategory : productCategories) {
            response.add(productCategory.getName());
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * get All the products in a category
     * POST to http://localhost:8080/getAllProductsInCategory
     *
     * @param payload should contain JSON key-value pairs with key(s): "categoryName"
     * @return NOT_FOUND if the category is not found, else product list
     */
    @RequestMapping(value = "/getAllProductsInCategory", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getAllProductsInCategory(@RequestBody Map<String, String> payload) {

        if (!payload.containsKey("categoryName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String categoryName = payload.get("categoryName");

        ProductCategory productCategory = productCategoryRepo.findByNameIgnoreCase(categoryName);
        if (productCategory == null) {
            return new ResponseEntity<>("no such category found", HttpStatus.NOT_FOUND);
        }

        Map<String, Map<String, Object>> response = new HashMap<>();
        for (String productName : productCategory.getProducts()) {
            Product product = productRepo.findByNameIgnoreCase(productName);
            Map<String, Object> productDetails = new HashMap<>();

            productDetails.put("name", product.getName());

            HashMap<String, Number> priceDetails = new HashMap<>();
            priceDetails.put("originalPrice", product.getPrice());
            priceDetails.put("discountPercentage", product.getDiscountPercentage());
            priceDetails.put("finalPrice", product.getPriceWithDiscount());
            productDetails.put("price", priceDetails);

            productDetails.put("description", product.getDescription());
            productDetails.put("average_rating", product.getAvgRating());

            HashMap<String, HashMap<String, Object>> reviews = new HashMap<>();
            for (Map.Entry<String, HashMap<String, String>> reviewDetails : product.getReviews().entrySet())
            {
                HashMap<String, Object> temp = new HashMap<>();
                temp.put("time_stamp",reviewDetails.getValue().get("timeStamp"));
                temp.put("username", reviewDetails.getKey());
                temp.put("review",reviewDetails.getValue().get("review"));
                temp.put("rating",reviewDetails.getValue().get("rating"));
                reviews.put(reviewDetails.getKey(),temp);
            }
            productDetails.put("reviews",reviews);

            response.put(product.getName(),productDetails);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * get All the categories of a product
     * POST to http://localhost:8080/getCategories
     *
     * @param payload should contain JSON key-value pairs with key(s): "productName"
     * @return NOT_FOUND if the category is not found, else product list
     */
    @RequestMapping(value = "/getCategories", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getCategories(@RequestBody Map<String, String> payload) {

        if (!payload.containsKey("productName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");

        if(productRepo.findByNameIgnoreCase(productName) == null)
        {
            return new ResponseEntity<>("no such product in database", HttpStatus.NOT_FOUND);
        }

        List<ProductCategory> productCategories = productCategoryRepo.findAll();
        if (productCategories == null || productCategories.isEmpty()) {
            return new ResponseEntity<>("no categories found", HttpStatus.NOT_FOUND);
        }

        ArrayList<String> response = new ArrayList<>();
        for (ProductCategory productCategory : productCategories) {
            if(productCategory.getProducts().contains(productName))
            {
                response.add(productCategory.getName());
            }
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

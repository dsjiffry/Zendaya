package com.coconutcoders.zendaya.zendayaBackend.controller;


import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ProductController
{
    @Autowired
    private ProductRepo productRepo;

    /**
     * Adds Product to Database
     * @param payload should contain JSON key-value pairs with keys: "productName", "price" and "description". Optional key "discount" can be included
     * @return CONFLICT if a product with same name is already in DB, else OK
     */
    @RequestMapping(value = "/addProduct", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addProduct(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("description") || !payload.containsKey("price"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String description = payload.get("description");
        final double price = Double.parseDouble(payload.get("price"));

        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product != null)
        {
            return new ResponseEntity<>("Product already in database", HttpStatus.CONFLICT);
        }

        product = new Product(productName,description,price);
        if(payload.containsKey("discount"))     //Optional JSON value
        {
            double discount = Double.parseDouble(payload.get("discount"));
            product.setDiscountPercentage(discount);
        }
        productRepo.save(product);
        return new ResponseEntity<>(product.getName()+" Added to Database", HttpStatus.OK);
    }

    /**
     * Adds a Review for a product, if a review is already present it will be updated
     * @param payload should contain JSON key-value pairs with keys: "productName", "username", "description" and "rating"
     * @return NOT FOUND if product is not in database, else OK
     */
    @RequestMapping(value = "/addReview", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addReview(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("username")
                || !payload.containsKey("description") || !payload.containsKey("rating"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");
        final String description = payload.get("description");
        final String ratingS = payload.get("rating");

        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product == null)
        {
            return new ResponseEntity<>("Product Not Found in database", HttpStatus.NOT_FOUND);
        }

        double rating = Double.parseDouble(ratingS);
        product.addOrUpdateReview(username, description, rating);

        productRepo.save(product);
        return new ResponseEntity<>(username+"'s review for "+ product.getName() +" Added to Database", HttpStatus.OK);
    }

    /**
     * Removes Product to Database
     * @param payload should contain JSON key-value pairs with keys: "productName"
     * @return NOT_FOUND if the product is not found in DB, else OK
     */
    @RequestMapping(value = "/removeProduct", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeProduct(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");

        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product == null)
        {
            return new ResponseEntity<>("No such Product in database", HttpStatus.NOT_FOUND);
        }

        productRepo.delete(product);
        return new ResponseEntity<>(product.getName()+" Deleted from Database", HttpStatus.OK);
    }

    /**
     * Update existing Product in Database
     * @param payload should contain JSON key-value pairs with keys: "productName" and "description". Optional key "discount" can be included
     * @return NOT_FOUND if no such Product in DB, else OK
     */
    @RequestMapping(value = "/updateProduct", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity updateProduct(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("description")|| !payload.containsKey("price"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String description = payload.get("description");
        final double price = Double.parseDouble(payload.get("price"));

        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product == null)
        {
            return new ResponseEntity<>("Product Not Found in database", HttpStatus.NOT_FOUND);
        }

        product.setDescription(description);
        product.setPrice(price);
        if(payload.containsKey("discount"))     //Optional JSON value
        {
            double discount = Double.parseDouble(payload.get("discount"));
            product.setDiscountPercentage(discount);
        }

        productRepo.save(product);
        return new ResponseEntity<>(product.getName()+" updated in Database", HttpStatus.OK);
    }




    /*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Searching and Sorting Functions
    */////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * find all product that contains given string in name
     * @param payload should contain JSON key-value pairs with keys: "productName".
     * @return A JSON array of the matching products.
     */
    @RequestMapping(value = "/searchProductsByName", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity searchProductsByName(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");

        List<Product> products = productRepo.findByNameIgnoreCaseContaining(productName);
        Map<String, Product> response = new HashMap<>();

        for(Product product : products)
        {
            response.put(product.getName(),product);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * find all products that have a discount
     * @return A JSON array of the matching products.
     */
    @RequestMapping(value = "/searchProductWithDiscount", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity searchProductWithDiscount()
    {
        List<Product> products = productRepo.findByDiscountPercentageGreaterThan(0);

        Map<String, Product> response = new HashMap<>();
        for(Product product : products)
        {
            response.put(product.getName(),product);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * find all products that gave a rating greater than or equal to a value
     * @param payload should contain JSON key-value pairs with keys: "rating".
     * @return A JSON array of the matching products.
     */
    @RequestMapping(value = "/findProductsWithRatingGreaterThanAndEqual", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity findProductsWithRatingGreaterThanAndEqual(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("rating"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        double rating = Double.parseDouble(payload.get("rating"));

        List<Product> products = productRepo.findByAvgRatingGreaterThanEqual(rating);

        Map<String, Product> response = new HashMap<>();
        for(Product product : products)
        {
            response.put(product.getName(),product);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}

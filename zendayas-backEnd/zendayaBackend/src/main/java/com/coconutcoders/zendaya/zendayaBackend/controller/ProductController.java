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

import java.util.Map;

@RestController
public class ProductController
{
    @Autowired
    private ProductRepo productRepo;

    /**
     * Adds Product to Database
     * @param payload should contain JSON key-value pairs with keys: "productName" and "description"
     * @return CONFLICT if a product with same name is already in DB, else OK
     */
    @RequestMapping(value = "/addProduct", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addProduct(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("description"))
        {
            return new ResponseEntity("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }

        Product product = productRepo.findByName(payload.get("productName"));
        if(product != null)
        {
            return new ResponseEntity("Product already in database", HttpStatus.CONFLICT);
        }

        product = new Product(payload.get("productName"),payload.get("description"));
        productRepo.save(product);
        return new ResponseEntity(product.getName()+" Added to Database", HttpStatus.OK);
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
            return new ResponseEntity("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }

        Product product = productRepo.findByName(payload.get("productName"));
        if(product == null)
        {
            return new ResponseEntity("Product Not Found in database", HttpStatus.NOT_FOUND);
        }

        double rating = Double.valueOf(payload.get("rating"));
        product.addOrUpdateReview(payload.get("username"), payload.get("description"), rating);

        productRepo.save(product);
        return new ResponseEntity(payload.get("username")+"'s review for "+ product.getName() +" Added to Database", HttpStatus.OK);
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
            return new ResponseEntity("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }

        Product product = productRepo.findByName(payload.get("productName"));
        if(product == null)
        {
            return new ResponseEntity("No such Product in database", HttpStatus.NOT_FOUND);
        }

        productRepo.delete(product);
        return new ResponseEntity(product.getName()+" Deleted from Database", HttpStatus.OK);
    }

    /**
     * Update existing Product in Database
     * @param payload should contain JSON key-value pairs with keys: "productName" and "description"
     * @return NOT_FOUND if no such Product in DB, else OK
     */
    @RequestMapping(value = "/updateProduct", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity updateProduct(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("description"))
        {
            return new ResponseEntity("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }

        Product product = productRepo.findByName(payload.get("productName"));
        if(product == null)
        {
            return new ResponseEntity("Product Not Found in database", HttpStatus.NOT_FOUND);
        }

        product.setDescription(payload.get("description"));
        productRepo.save(product);
        return new ResponseEntity(product.getName()+" updated in Database", HttpStatus.OK);
    }
}

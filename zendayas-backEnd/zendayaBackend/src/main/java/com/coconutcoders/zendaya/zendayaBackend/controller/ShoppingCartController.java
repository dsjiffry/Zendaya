package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import com.coconutcoders.zendaya.zendayaBackend.model.ShoppingCart;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ShoppingCartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ShoppingCartController
{
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    /**
     * Checks for product in database and then adds it to the user's Shopping Cart
     * @param payload Should contain JSON key-value pairs with keys: "username" and "productName" and optional key "quantity"
     * @return NOT FOUND if product is not in database, else OK
     */
    @RequestMapping(value = "/addToShoppingCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addToShoppingCart(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("username"))
        {
            return new ResponseEntity("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");
        int quantity = 1;
        try {
            quantity = Integer.valueOf(payload.get("quantity"));
        }catch (NumberFormatException e)
        {
            quantity = 1;
        }

        //Checking for Product in DB
        Product product = productRepo.findByName(productName);
        if(product == null)
        {
            return new ResponseEntity("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);

        if(sCart == null)    //need to create a new Shopping Cart for this user
        {
            sCart = new ShoppingCart(username);
            sCart.addProduct(productName);
        }
        else    //this user already has a Shopping Cart
        {
            if(!sCart.isProductAlreadyInCart(productName))
            {
                sCart.addProduct(productName);
            }
        }
        if(quantity > 1)    //The user is ordering more than 1 item
        {
            sCart.changeQuantity(productName,quantity);
        }

        shoppingCartRepo.save(sCart);

        return new ResponseEntity(productName+" added to "+username+"'s Shopping Cart", HttpStatus.OK);
    }

    /**
     * Checks for product in database and then removes it from the user's Shopping Cart
     * @param payload Should contain JSON key-value pairs with keys: "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a Shopping Cart, else OK
     */
    @RequestMapping(value = "/removeFromShoppingCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeFromShoppingCart(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("username"))
        {
            return new ResponseEntity("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");

        //Checking for Product in DB
        Product product = productRepo.findByName(productName);
        if(product == null)
        {
            return new ResponseEntity("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);

        if(sCart == null)    //User doesn't have a Shopping Cart
        {
            return new ResponseEntity("Shopping Cart was not found", HttpStatus.NOT_FOUND);
        }
        else    //this user has a Shopping Cart
        {
            if(sCart.isProductAlreadyInCart(productName))
            {
                sCart.removeProduct(productName);
            }
        }

        shoppingCartRepo.save(sCart);

        return new ResponseEntity(productName+" removed from "+username+"'s Shopping Cart", HttpStatus.OK);
    }

}

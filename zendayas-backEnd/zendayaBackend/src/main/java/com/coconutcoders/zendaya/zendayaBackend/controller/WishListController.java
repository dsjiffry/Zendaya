package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import com.coconutcoders.zendaya.zendayaBackend.model.ShoppingCart;
import com.coconutcoders.zendaya.zendayaBackend.model.WishList;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ShoppingCartRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.WishListRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WishListController {


    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private WishListRepo wishListRepo;

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    /**
     * Checks for product in database and then adds it to the user's wish list
     * @param payload Should contain JSON key-value pairs with keys: "username" and "productName"
     * @return NOT FOUND if product is not in database, else OK
     */
    @RequestMapping(value = "/addToWishList", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addToWishList(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("username"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");

        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product == null)
        {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        WishList wishList = wishListRepo.findByUsername(username);

        if(wishList == null)    //need to create a new wishlist for this user
        {
            wishList = new WishList(username);
            wishList.addProduct(productName);
        }
        else    //this user already has a wishlist
        {
            if(!wishList.isProductAlreadyInWishList(productName))
            {
                wishList.addProduct(productName);
            }
        }

        wishListRepo.save(wishList);

        return new ResponseEntity<>(productName+" added to "+username+"'s wish list", HttpStatus.OK);
    }


    /**
     * Checks for product in database and then removes it from the user's wish list
     * @param payload Should contain JSON key-value pairs with keys: "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a wish list, else OK
     */
    @RequestMapping(value = "/removeFromWishList", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeFromWishList(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("username"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");

        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product == null)
        {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        WishList wishList = wishListRepo.findByUsername(username);

        if(wishList == null)    //User doesn't have a wish list
        {
            return new ResponseEntity<>("Wish list was not found", HttpStatus.NOT_FOUND);
        }
        else    //this user has a wish list
        {
            if(wishList.isProductAlreadyInWishList(productName))
            {
                wishList.removeProduct(productName);
            }
        }

        wishListRepo.save(wishList);

        return new ResponseEntity<>(productName+" removed from "+username+"'s wish list", HttpStatus.OK);
    }


    /**
     * Transfers a product from the wish list to the Shopping Cart
     * @param payload Should contain JSON key-value pairs with keys: "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a wish list, else OK
     */
    @RequestMapping(value = "/moveToShoppingCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity moveToShoppingCart(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("productName") || !payload.containsKey("username"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");


        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if(product == null)
        {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }

        WishList wishList = wishListRepo.findByUsername(username);

        if(wishList == null)    //user does not have a wishlist
        {
            return new ResponseEntity<>("Wish list was not found", HttpStatus.NOT_FOUND);
        }
        if(!wishList.isProductAlreadyInWishList(productName))    //Product was not found in wish list
        {
            return new ResponseEntity<>("No such product in wish list", HttpStatus.NOT_FOUND);
        }

        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);
        if(sCart == null)   //User does not have a shopping cart
        {
            sCart = new ShoppingCart(username);
        }
        sCart.addProduct(productName);
        shoppingCartRepo.save(sCart);
        removeFromWishList(payload);

        return new ResponseEntity<>(productName+" moved to Shopping Cart", HttpStatus.OK);
    }
}


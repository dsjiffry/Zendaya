package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import com.coconutcoders.zendaya.zendayaBackend.model.WishList;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
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

    /**
     * Checks for product in database and then adds it to the user's wish list
     * @param payload Should contain 2 key-value pairs with keys "username" and "productName"
     * @return NOT FOUND if product is not in database, else OK
     */
    @RequestMapping(value = "/addToWishList", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity AddToWishList(@RequestBody Map<String, String> payload)
    {
        //Checking for Product in DB
        Product product = productRepo.findByName(payload.get("productName"));
        if(product == null)
        {
            return new ResponseEntity("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        WishList wishList = wishListRepo.findByUsername(payload.get("username"));

        if(wishList == null)    //need to create a new wishlist for this user
        {
            wishList = new WishList(payload.get("username"));
            wishList.addProduct(product);
        }
        else    //this user already has a wishlist
        {
            if(!wishList.isProductAlreadyInWishList(product))
            {
                wishList.addProduct(product);
            }
        }

        wishListRepo.save(wishList);

        return new ResponseEntity(payload.get("productName")+" added to "+payload.get("username")+"'s wish list", HttpStatus.OK);
    }

}

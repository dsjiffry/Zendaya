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
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class WishListController {


    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private WishListRepo wishListRepo;

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    /**
     * Checks for product in database and then adds it to the user's wish list
     * POST to http://localhost:8080/addToWishList
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username" and "productName"
     * @return NOT FOUND if product is not in database, else OK
     */
    @RequestMapping(value = "/addToWishList", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addToWishList(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("productName") || !payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");

        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if (product == null) {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        WishList wishList = wishListRepo.findByUsername(username);

        if (wishList == null)    //need to create a new wishlist for this user
        {
            wishList = new WishList(username);
            wishList.addProduct(productName);
        } else    //this user already has a wishlist
        {
            if (!wishList.isProductAlreadyInWishList(productName)) {
                wishList.addProduct(productName);
            }
        }

        wishListRepo.save(wishList);

        return new ResponseEntity<>(productName + " added to " + username + "'s wish list", HttpStatus.OK);
    }


    /**
     * Checks for product in database and then removes it from the user's wish list
     * POST to http://localhost:8080/removeFromWishList
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a wish list, else OK
     */
    @RequestMapping(value = "/removeFromWishList", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeFromWishList(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("productName") || !payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");

        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if (product == null) {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        WishList wishList = wishListRepo.findByUsername(username);

        if (wishList == null)    //User doesn't have a wish list
        {
            return new ResponseEntity<>("Wish list was not found", HttpStatus.NOT_FOUND);
        } else    //this user has a wish list
        {
            if (wishList.isProductAlreadyInWishList(productName)) {
                wishList.removeProduct(productName);
            }
        }

        wishListRepo.save(wishList);

        return new ResponseEntity<>(productName + " removed from " + username + "'s wish list", HttpStatus.OK);
    }


    /**
     * Transfers a product from the wish list to the Shopping Cart
     * POST to http://localhost:8080/moveToShoppingCart
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a wish list, else OK
     */
    @RequestMapping(value = "/moveToShoppingCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity moveToShoppingCart(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("productName") || !payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");


        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if (product == null) {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }

        WishList wishList = wishListRepo.findByUsername(username);

        if (wishList == null)    //user does not have a wishlist
        {
            return new ResponseEntity<>("Wish list was not found", HttpStatus.NOT_FOUND);
        }
        if (!wishList.isProductAlreadyInWishList(productName))    //Product was not found in wish list
        {
            return new ResponseEntity<>("No such product in wish list", HttpStatus.NOT_FOUND);
        }

        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);
        if (sCart == null)   //User does not have a shopping cart
        {
            sCart = new ShoppingCart(username);
        }
        sCart.addProduct(productName);
        shoppingCartRepo.save(sCart);
        removeFromWishList(payload);

        return new ResponseEntity<>(productName + " moved to Shopping Cart", HttpStatus.OK);
    }

    /**
     * Transfers a product from the Shopping Cart to the wishlist
     * POST to http://localhost:8080/moveToWishList
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a wish list, else OK
     */
    @RequestMapping(value = "/moveToWishList", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity moveToWishList(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("productName") || !payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");

        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);
        if (sCart == null)   //User does not have a shopping cart
        {
            return new ResponseEntity<>("Shopping cart was not found", HttpStatus.NOT_FOUND);
        }

        if (!sCart.isProductAlreadyInCart(productName)) {
            return new ResponseEntity<>("Product not in shopping cart", HttpStatus.NOT_FOUND);
        }

        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if (product == null) {
            return new ResponseEntity<>("Product was not found in database", HttpStatus.NOT_FOUND);
        }

        WishList wishList = wishListRepo.findByUsername(username);

        if (wishList == null)    //user does not have a wishlist
        {
            wishList = new WishList(username);
        }

        wishList.addProduct(productName);
        wishListRepo.save(wishList);

        sCart.removeProduct(productName);
        shoppingCartRepo.save(sCart);

        return new ResponseEntity<>(productName + " moved to Wish List", HttpStatus.OK);
    }

    /**
     * returns the items, their individual price and quantity in Wishlist
     * POST to http://localhost:8080/getWishListProductsAndDetails
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username"
     * @return response a JSON array.
     */
    @RequestMapping(value = "/getWishListProductsAndDetails", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getWishListProductsAndDetails(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        WishList wishList = wishListRepo.findByUsername(username);

        if (wishList == null) {
            return new ResponseEntity<>("No Wish List found for user " + username, HttpStatus.NOT_FOUND);
        } else {
            Map<String, HashMap<String, Object>> response = new HashMap<>();

            ArrayList<String> wishListProducts = wishList.getWishlist();
            for (String product : wishListProducts) {

                Product tempProduct = productRepo.findByNameIgnoreCase(product);
                HashMap<String, Object> temp = new HashMap<>();

                temp.put("productName", tempProduct.getName());

                HashMap<String, Number> priceDetails = new HashMap<>();

                priceDetails.put("originalPrice", tempProduct.getPrice());
                priceDetails.put("discountPercentage", tempProduct.getDiscountPercentage());
                priceDetails.put("finalPrice", tempProduct.getPriceWithDiscount());

                temp.put("price", priceDetails);


                response.put(product, temp);
            }


            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    /**
     * returns the total price and number of items in WishList
     * This will apply discounts to the products, if they have it.
     * POST to http://localhost:8080/getWishListTotalPriceAndNumberOfItems
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username"
     * @return response with JSON keys: "numberOfItems" and "totalPrice"
     */
    @RequestMapping(value = "/getWishListTotalPriceAndNumberOfItems", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getWishListTotalPriceAndNumberOfItems(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        WishList wishList = wishListRepo.findByUsername(username);

        if (wishList == null) {
            return new ResponseEntity<>("No Wish List found for user " + username, HttpStatus.NOT_FOUND);
        } else {

            Map<String, Number> response = new HashMap<>();
            response.put("numberOfItems", wishList.getNumberOfItems());
            response.put("totalPrice", wishList.getTotalPrice(productRepo));

            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

}


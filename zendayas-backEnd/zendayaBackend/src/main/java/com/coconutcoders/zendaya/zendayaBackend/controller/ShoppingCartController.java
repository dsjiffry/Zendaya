package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.enums.PaymentMethod;
import com.coconutcoders.zendaya.zendayaBackend.model.Payment;
import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import com.coconutcoders.zendaya.zendayaBackend.model.ShoppingCart;
import com.coconutcoders.zendaya.zendayaBackend.repo.PaymentRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ShoppingCartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ShoppingCartController {
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    /**
     * Checks for product in database and then adds it to the user's Shopping Cart
     * POST to http://localhost:8080/addToShoppingCart
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username" and "productName" and optional key "quantity"
     * @return NOT FOUND if product is not in database, else OK
     */
    @RequestMapping(value = "/addToShoppingCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addToShoppingCart(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("productName") || !payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String username = payload.get("username");
        int quantity;
        try {
            quantity = Integer.parseInt(payload.get("quantity"));
        } catch (NumberFormatException e) {
            quantity = 1;
        }

        //Checking for Product in DB
        Product product = productRepo.findByNameIgnoreCase(productName);
        if (product == null) {
            return new ResponseEntity<>("Product was not found", HttpStatus.NOT_FOUND);
        }
        //Since this can only be called after the user signs in, will not be verifying username.


        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);

        if (sCart == null)    //need to create a new Shopping Cart for this user
        {
            sCart = new ShoppingCart(username);
            sCart.addProduct(productName);
        } else    //this user already has a Shopping Cart
        {
            if (!sCart.isProductAlreadyInCart(productName)) {
                sCart.addProduct(productName);
            }
        }
        if (quantity > 1)    //The user is ordering more than 1 item
        {
            sCart.changeQuantity(productName, quantity);
        }

        shoppingCartRepo.save(sCart);

        return new ResponseEntity<>(productName + " added to " + username + "'s Shopping Cart", HttpStatus.OK);
    }

    /**
     * Checks for product in database and then removes it from the user's Shopping Cart
     * POST to http://localhost:8080/removeFromShoppingCart
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username" and "productName"
     * @return NOT FOUND if product is not in database or if user doesn't have a Shopping Cart, else OK
     */
    @RequestMapping(value = "/removeFromShoppingCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeFromShoppingCart(@RequestBody Map<String, String> payload) {
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


        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);

        if (sCart == null)    //User doesn't have a Shopping Cart
        {
            return new ResponseEntity<>("Shopping Cart was not found", HttpStatus.NOT_FOUND);
        } else    //this user has a Shopping Cart
        {
            if (sCart.isProductAlreadyInCart(productName)) {
                sCart.removeProduct(productName);
            }
        }

        shoppingCartRepo.save(sCart);

        return new ResponseEntity<>(productName + " removed from " + username + "'s Shopping Cart", HttpStatus.OK);
    }

    /**
     * returns the total price and number of items.
     * This will apply discounts to the products, if they have it.
     * POST to http://localhost:8080/getTotalPriceAndNumberOfItems
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username"
     * @return response with JSON keys: "numberOfItems" and "totalPrice"
     */
    @RequestMapping(value = "/getTotalPriceAndNumberOfItems", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getTotalPriceAndNumberOfItems(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);

        if (sCart == null) {
            return new ResponseEntity<>("No shopping cart found for user " + username, HttpStatus.NOT_FOUND);
        } else {

            Map<String, Number> response = new HashMap<>();
            response.put("numberOfItems", sCart.getNumberOfItems());
            response.put("totalPrice", sCart.getTotalPrice(productRepo));

            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    /**
     * returns the items, their individual price and quantity
     * POST to http://localhost:8080/getProductsAndDetails
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username"
     * @return response a JSON array.
     */
    @RequestMapping(value = "/getProductsAndDetails", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getProductsAndDetails(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        ShoppingCart sCart = shoppingCartRepo.findByUsername(username);

        if (sCart == null) {
            return new ResponseEntity<>("No shopping cart found for user " + username, HttpStatus.NOT_FOUND);
        } else {
            Map<String, HashMap<String, Number>> response = new HashMap<>();

            HashMap<String, Integer> productList = sCart.getProductAndQuantity();
            for (Map.Entry<String, Integer> product : productList.entrySet()) {
                String productName = product.getKey();
                int quantity = product.getValue();

                Product tempProduct = productRepo.findByNameIgnoreCase(productName);
                HashMap<String, Number> temp = new HashMap<>();

                temp.put("quantity", quantity);
                temp.put("originalPrice", tempProduct.getPrice());
                temp.put("discountPercentage", tempProduct.getDiscountPercentage());
                temp.put("finalPrice", tempProduct.getPriceWithDiscount());

                response.put(productName, temp);
            }


            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    /**
     * Make the Payment for the items in the shopping cart
     * POST to http://localhost:8080/purchaseItemsInCart
     *
     * @param payload Should contain JSON key-value pairs with key(s): "username", "paymentMode", "address"
     *                if "paymentMode" is "card" then: "creditCardNumber","creditCardCVC", "creditCardExpiryDate"
     * @return NOT FOUND if no cart for user, else OK
     */
    @RequestMapping(value = "/purchaseItemsInCart", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity purchaseItemsInCart(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("paymentMode") || !payload.containsKey("address")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String address = payload.get("address");

        ShoppingCart shoppingCart = shoppingCartRepo.findByUsername(username);
        if (shoppingCart == null) {
            return new ResponseEntity<>("No shopping cart found for this user", HttpStatus.NOT_FOUND);
        }

        Payment payment = new Payment(username);
        PaymentMethod paymentMode;

        if (payload.get("paymentMode").equalsIgnoreCase("cash")) {
            payment.setPaymentCash(address);

        } else if (payload.get("paymentMode").equalsIgnoreCase("credit card")) {
            if (!payload.containsKey("creditCardNumber") || !payload.containsKey("creditCardCVC") || !payload.containsKey("creditCardExpiryDate")) {
                return new ResponseEntity<>("Credit card details not found", HttpStatus.NOT_FOUND);
            }
            final String creditCardNumber = payload.get("creditCardNumber");
            final int creditCardCVC = Integer.valueOf(payload.get("creditCardCVC"));
            final String creditCardExpiryDate = payload.get("creditCardExpiryDate");
            payment.setPaymentCard(creditCardNumber, creditCardCVC, creditCardExpiryDate, address);

        } else {
            return new ResponseEntity<>("Invalid Payment method", HttpStatus.NOT_FOUND);
        }


        //Implement Payment Gateway here


        payment.setItems(shoppingCart, productRepo);
        paymentRepo.save(payment);

        shoppingCartRepo.delete(shoppingCart);
        return new ResponseEntity<>("Payment Successful", HttpStatus.OK);
    }
}

package com.coconutcoders.zendaya.zendayaBackend.model;

import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;

public class WishList {
    @Id
    private ObjectId id;

    private String username;
    private ArrayList<String> wishlist = new ArrayList<>();

    private WishList() {
    }

    public WishList(String username) {
        this.username = username;
    }

    public void addProduct(String productName) {
        wishlist.add(productName);
    }

    public void removeProduct(String productName) {
        wishlist.remove(productName);
    }

    /**
     * @return true means product was found in wish List
     */
    public boolean isProductAlreadyInWishList(String productName) {
        for (String p : wishlist) {
            if (p.equals(productName)) {
                return true;
            }
        }
        return false;
    }


    public String getUsername() {
        return username;
    }

    public ArrayList<String> getWishlist() {
        return wishlist;
    }

    public double getTotalPrice(ProductRepo productRepo) {
        double totalPrice = 0;
        for (String productName : wishlist) {
            Product product = productRepo.findByNameIgnoreCase(productName);
            double price = product.getPriceWithDiscount();
            totalPrice += price;
        }
        return totalPrice;
    }

    public int getNumberOfItems() {
        return wishlist.size();
    }
}

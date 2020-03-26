package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;

public class ShoppingCart
{
    @Id
    private ObjectId id;

    private String username;
    private ArrayList<String> productList = new ArrayList<>(); //Names of products in a users wishlist

    private ShoppingCart(){}
    public ShoppingCart(String username)
    {
        this.username = username;
    }

    public void addProduct(String productName)
    {
        if(!isProductAlreadyInCart(productName))
        {
            productList.add(productName);
        }
    }

    public void removeProduct(String productName)
    {
        productList.remove(productName);
    }

    /**
     * @return true means product was found in Shopping Cart
     */
    public boolean isProductAlreadyInCart(String productName)
    {
        for(String p : productList)
        {
            if(p.equals(productName))
            {
                return true;
            }
        }
        return false;
    }









}

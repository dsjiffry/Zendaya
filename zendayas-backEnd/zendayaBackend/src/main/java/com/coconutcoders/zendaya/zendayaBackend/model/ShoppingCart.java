package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.HashMap;

public class ShoppingCart
{
    @Id
    private ObjectId id;

    private String username;
    private ArrayList<String> productList = new ArrayList<>(); //Names of products in a users wishlist
    private HashMap<String, Integer> productQuantity;   //Product name and it's quantity (default is 1)

    private ShoppingCart(){}
    public ShoppingCart(String username)
    {
        this.username = username;
        productQuantity = new HashMap<>();
    }

    public void addProduct(String productName)
    {
        if(!isProductAlreadyInCart(productName))
        {
            productList.add(productName);
            productQuantity.put(productName,1);
        }
    }

    public void removeProduct(String productName)
    {
        productList.remove(productName);
        productQuantity.remove(productName);
    }

    public void changeQuantity(String productName, int quantity)
    {
        productQuantity.put(productName,quantity);
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

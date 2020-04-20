package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.HashMap;
import java.util.Map;

public class ShoppingCart
{
    @Id
    private ObjectId id;

    private String username;
    private HashMap<String, Integer> productAndQuantity;   //Product name and it's quantity (default is 1)

    private ShoppingCart(){}
    public ShoppingCart(String username)
    {
        this.username = username;
        this.productAndQuantity = new HashMap<>();
    }

    public void addProduct(String productName)
    {
        if(!isProductAlreadyInCart(productName))
        {
            productAndQuantity.put(productName,1);
        }
    }

    public void removeProduct(String productName)
    {
        productAndQuantity.remove(productName);
    }

    public void changeQuantity(String productName, int quantity)
    {
        productAndQuantity.put(productName,quantity);
    }

    /**
     * @return true means product was found in Shopping Cart
     */
    public boolean isProductAlreadyInCart(String productName)
    {
        if(productAndQuantity.isEmpty())
        {
            return false;
        }

        for(Map.Entry<String, Integer> p : productAndQuantity.entrySet())
        {
            if(p.getKey().equals(productName))
            {
                return true;
            }
        }
        return false;
    }

    public HashMap<String, Integer> getProductAndQuantity() {
        return productAndQuantity;
    }
}

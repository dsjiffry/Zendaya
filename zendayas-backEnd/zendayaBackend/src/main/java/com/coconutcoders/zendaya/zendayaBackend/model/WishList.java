package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;

public class WishList
{
    @Id
    private ObjectId id;

    private String username;
    private ArrayList<String> wishlist = new ArrayList<>();

    private WishList(){}
    public WishList(String username)
    {
        this.username = username;
    }


    public void addProduct(String productName)
    {
        wishlist.add(productName);
    }

    public void removeProduct(String productName)
    {
        wishlist.remove(productName);
    }

    /**
     * @return true means product was found in wish List
     */
    public boolean isProductAlreadyInWishList(String productName)
    {
        for(String p : wishlist)
        {
            if(p.equals(productName))
            {
                return true;
            }
        }
        return false;
    }


    public String getUsername() {
        return username;
    }
}

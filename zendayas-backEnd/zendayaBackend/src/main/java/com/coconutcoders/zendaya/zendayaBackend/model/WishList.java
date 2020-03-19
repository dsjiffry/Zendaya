package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;

public class WishList
{
    @Id
    private ObjectId id;

    private String username;
    private ArrayList<Product> wishlist = new ArrayList<>();

    private WishList(){}
    public WishList(String username)
    {
        this.username = username;
    }


    public void addProduct(Product product)
    {
        wishlist.add(product);
    }

    public void removeProduct(Product product)
    {
        wishlist.remove(product);
    }

    /**
     * @return true means product had already been added to wish List
     */
    public boolean isProductAlreadyInWishList(Product product)
    {
        for(Product p : wishlist)
        {
            if(p.getName().equals(product.getName()))
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

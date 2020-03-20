package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Product
{
    @Id
    private ObjectId id;

    private String name;    //Should be unique
    private String description;
    private HashMap<String, Double> ratings;    //Username and the rating given
    private HashMap<String, Date> reviewTimeStamp;    //Username and the date of the Review
    private HashMap<String, String> reviews;    //Username and the review given

    private Product(){}
    public Product(String name, String description) {
        this.name = name;
        this.description = description;
        reviewTimeStamp = new HashMap<>();
        ratings = new HashMap<>();
        reviews = new HashMap<>();
    }

    public void addOrUpdateReview(String username, String review, Double rating)
    {
        if(ratings.containsKey(username))
        {
            reviews.remove(username);
            ratings.remove(username);
        }
        reviewTimeStamp.put(username,new Date());
        reviews.put(username, review);
        ratings.put(username, rating);
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getAvgRating()
    {
        double sumRating = 0;
        for(Map.Entry<String, Double> rating : ratings.entrySet())
        {
            sumRating += rating.getValue();
        }
        return sumRating/ratings.size();
    }

    public void setDescription(String description)
    {
        this.description = description;
    }
}

package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Product
{
    @Id
    private ObjectId id;

    private String name;
    private String description;
    private double avgRating;

    private Product(){}
    public Product(String name, String description, double avgRating) {
        this.name = name;
        this.description = description;
        this.avgRating = avgRating;
    }


    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getAvgRating() {
        return avgRating;
    }
}

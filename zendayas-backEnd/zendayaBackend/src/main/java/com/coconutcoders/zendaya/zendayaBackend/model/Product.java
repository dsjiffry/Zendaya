package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Product {
    @Id
    private ObjectId id;

    private String name;    //Should be unique
    private String description;
    private double discountPercentage = 0;
    private double avgRating = 0;
    private double price = 0;
    private HashMap<String, Double> ratings;    //Username and the rating given
    private HashMap<String, Date> reviewTimeStamp;    //Username and the date of the Review
    private HashMap<String, String> reviews;    //Username and the review given

    private Product() {
    }

    public Product(String name, String description, double price) {
        this.name = name;
        this.description = description;
        this.price = price;
        reviewTimeStamp = new HashMap<>();
        ratings = new HashMap<>();
        reviews = new HashMap<>();
    }

    public void addOrUpdateReview(String username, String review, Double rating) {
        if (ratings.containsKey(username)) {
            reviews.remove(username);
            ratings.remove(username);
        }
        reviewTimeStamp.put(username, new Date());
        reviews.put(username, review);
        ratings.put(username, rating);
        avgRating = calculateAvgRating();
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

    public double calculateAvgRating() {
        double sumRating = 0;
        if (ratings.size() == 0) {
            return sumRating;
        }

        for (Map.Entry<String, Double> rating : ratings.entrySet()) {
            sumRating += rating.getValue();
        }
        return sumRating / ratings.size();
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getPriceWithDiscount() {
        return price - (price * (discountPercentage / 100));
    }

    public HashMap<String, HashMap<String,String>> getReviews() {
        HashMap<String, HashMap<String, String>> reviewDetails = new HashMap<>();
        for (Map.Entry<String, String> entry : reviews.entrySet()) {
            HashMap<String, String> temp = new HashMap<>();
            temp.put("timeStamp", String.valueOf(reviewTimeStamp.get(entry.getKey())));
            temp.put("review", entry.getValue());
            temp.put("rating", String.valueOf(ratings.get(entry.getValue())));
            reviewDetails.put(entry.getKey(), temp);
        }
        return reviewDetails;
    }

    public void setName(String name) {
        this.name = name;
    }
}

package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.*;

public class ProductCategory {

    @Id
    private ObjectId id;
    private String name;
    private Set<String> products;

    private ProductCategory() {}
    public ProductCategory(String category) {
        this.name = category;
        products = new HashSet<>();
    }

    public void addProductToCategory(String productName) {
        products.add(productName);
    }

    public void removeProductFromCategory(String productName) {
        products.remove(productName);
    }

    public boolean doesCategoryContainProduct(String productName)
    {
        return products.contains(productName);
    }

    public String getName() {
        return name;
    }

    public Set<String> getProducts() {
        return products;
    }
}

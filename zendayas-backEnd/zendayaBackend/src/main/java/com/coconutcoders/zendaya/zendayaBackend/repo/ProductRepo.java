package com.coconutcoders.zendaya.zendayaBackend.repo;

import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductRepo extends MongoRepository<Product, String>
{
    public Product findByNameIgnoreCase(String name);
    public List<Product> findByNameIgnoreCaseContaining(String name);
    public List<Product> findByDiscountPercentageGreaterThan(double value);
    public List<Product> findByAvgRatingGreaterThanEqual(double value);
}

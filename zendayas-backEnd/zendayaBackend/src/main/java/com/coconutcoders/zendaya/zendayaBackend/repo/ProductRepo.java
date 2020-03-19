package com.coconutcoders.zendaya.zendayaBackend.repo;

import com.coconutcoders.zendaya.zendayaBackend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepo extends MongoRepository<Product, String>
{
    public Product findByName(String name);
}

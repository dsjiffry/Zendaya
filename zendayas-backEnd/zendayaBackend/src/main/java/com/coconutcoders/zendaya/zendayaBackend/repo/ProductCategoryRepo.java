package com.coconutcoders.zendaya.zendayaBackend.repo;


import com.coconutcoders.zendaya.zendayaBackend.model.ProductCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepo extends MongoRepository<ProductCategory, String> {
    ProductCategory findByNameIgnoreCase(String name);
}

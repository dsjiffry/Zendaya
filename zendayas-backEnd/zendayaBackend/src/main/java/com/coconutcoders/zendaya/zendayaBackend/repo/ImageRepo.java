package com.coconutcoders.zendaya.zendayaBackend.repo;

import com.coconutcoders.zendaya.zendayaBackend.model.Image;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepo extends MongoRepository<Image, String> {
    Image findByProductName(String productName);
}

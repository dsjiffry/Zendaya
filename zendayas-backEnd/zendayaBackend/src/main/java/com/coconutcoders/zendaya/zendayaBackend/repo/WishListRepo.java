package com.coconutcoders.zendaya.zendayaBackend.repo;

import com.coconutcoders.zendaya.zendayaBackend.model.WishList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishListRepo extends MongoRepository<WishList, String>
{
    WishList findByUsername(String username);
}
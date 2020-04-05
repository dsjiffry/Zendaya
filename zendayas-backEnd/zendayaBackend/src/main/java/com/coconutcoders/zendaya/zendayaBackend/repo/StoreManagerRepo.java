package com.coconutcoders.zendaya.zendayaBackend.repo;


import com.coconutcoders.zendaya.zendayaBackend.model.StoreManager;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreManagerRepo extends MongoRepository<StoreManager, Long>
{
    StoreManager findStoreManagerByUsername(String username);

}
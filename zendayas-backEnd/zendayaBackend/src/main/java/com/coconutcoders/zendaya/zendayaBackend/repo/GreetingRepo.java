package com.coconutcoders.zendaya.zendayaBackend.repo;

import com.coconutcoders.zendaya.zendayaBackend.model.Greeting;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GreetingRepo extends MongoRepository<Greeting,Long> {

    public Greeting findByName(String name);

}

package com.coconutcoders.zendaya.zendayaBackend.repo;


import com.coconutcoders.zendaya.zendayaBackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends MongoRepository<User, Long> {

    User findUserByUsername(String username);

    User findUserByEmail(String email);

    List<User> findByUsernameIgnoreCaseContaining(String username);

}

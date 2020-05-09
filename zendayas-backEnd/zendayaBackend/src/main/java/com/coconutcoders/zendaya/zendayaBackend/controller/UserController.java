package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.User;
import com.coconutcoders.zendaya.zendayaBackend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    UserRepo userRepo;

    /**
     * Creating a normal user
     * POST to http://localhost:8080/createUser
     *
     * @param payload should contain JSON key-value pairs with key(s): "username", "password"
     * @return ACCEPTED if successful
     */
    @PostMapping(value = "/createUser")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("password")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String password = payload.get("password");

        if(userRepo.findUserByUsername(username) != null)
        {
            return new ResponseEntity<>("username is taken", HttpStatus.CONFLICT);
        }

        User user = new User(username, password);
        user.setUser();
        userRepo.save(user);
        System.out.println(userRepo.findUserByUsername(username).getUsername() + " " + userRepo.findUserByUsername(username).getUsername());
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Creating an admin
     * POST to http://localhost:8080/createAdmin
     *
     * @param payload should contain JSON key-value pairs with key(s): "username", "password"
     * @return ACCEPTED if successful
     */
    @PostMapping(value = "/createAdmin")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("password")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String password = payload.get("password");

        if(userRepo.findUserByUsername(username) != null)
        {
            return new ResponseEntity<>("username is taken", HttpStatus.CONFLICT);
        }

        User user = new User(username, password);
        user.setAdmin();
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Creating a Store Manager. If admin details are valid only will the new store manager be added.
     * POST to http://localhost:8080/createStoreManager
     *
     * @param payload should contain JSON key-value pairs with key(s): "adminUsername", "adminPassword", "StoreManagerUsername", "StoreManagerPassword"
     * @return UNAUTHORIZED if admin details are invalid, else ACCEPTED
     */
    @PostMapping(value = "/createStoreManager")
    public ResponseEntity<?> createStoreManager(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("adminUsername") || !payload.containsKey("adminPassword")
                || !payload.containsKey("StoreManagerUsername") || !payload.containsKey("StoreManagerPassword")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String AdminUsername = payload.get("adminUsername");
        final String AdminPassword = payload.get("adminPassword");
        final String SM_Username = payload.get("StoreManagerUsername");
        final String SM_Password = payload.get("StoreManagerPassword");

        User admin = userRepo.findUserByUsername(AdminUsername);
        if (!admin.isThisThePassword(AdminPassword)) {
            return new ResponseEntity<>("Invalid Admin login", HttpStatus.UNAUTHORIZED);
        }

        if (userRepo.findUserByUsername(SM_Username) != null) {
            return new ResponseEntity<>("username is taken", HttpStatus.CONFLICT);
        }


        User user = new User(SM_Username, SM_Password);
        user.setStoreManager();
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}


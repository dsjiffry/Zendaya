package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.enums.UserRoles;
import com.coconutcoders.zendaya.zendayaBackend.model.User;
import com.coconutcoders.zendaya.zendayaBackend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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
     * @param payload should contain JSON key-value pairs with key(s): "username", "password", "email"
     * @return ACCEPTED if successful
     */
    @PostMapping(value = "/createUser")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("password") || !payload.containsKey("email")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String password = payload.get("password");
        final String email = payload.get("email");

        if (userRepo.findUserByUsername(username) != null) {
            return new ResponseEntity<>("username is taken", HttpStatus.CONFLICT);
        }

        if (userRepo.findUserByEmail(email) != null) {
            return new ResponseEntity<>("email is taken", HttpStatus.CONFLICT);
        }

        User user = new User(username, password, email);
        user.setUser();
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Creating an admin
     * POST to http://localhost:8080/createAdmin
     *
     * @param payload should contain JSON key-value pairs with key(s): "username", "password", "email"
     * @return ACCEPTED if successful
     */
    @PostMapping(value = "/createAdmin")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("password") || !payload.containsKey("email")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String password = payload.get("password");
        final String email = payload.get("email");

        if (userRepo.findUserByUsername(username) != null) {
            return new ResponseEntity<>("username is taken", HttpStatus.CONFLICT);
        }

        if (userRepo.findUserByEmail(email) != null) {
            return new ResponseEntity<>("email is taken", HttpStatus.CONFLICT);
        }

        User user = new User(username, password, email);
        user.setAdmin();
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Creating a Store Manager. If admin details are valid only will the new store manager be added.
     * POST to http://localhost:8080/createStoreManager
     *
     * @param payload should contain JSON key-value pairs with key(s): "adminUsername", "adminPassword", "StoreManagerUsername", "StoreManagerPassword", "StoreManagerEmail"
     * @return UNAUTHORIZED if admin details are invalid, else ACCEPTED
     */
    @PostMapping(value = "/createStoreManager")
    public ResponseEntity<?> createStoreManager(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("adminUsername") || !payload.containsKey("adminPassword") || !payload.containsKey("StoreManagerEmail")
                || !payload.containsKey("StoreManagerUsername") || !payload.containsKey("StoreManagerPassword")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String AdminUsername = payload.get("adminUsername");
        final String AdminPassword = payload.get("adminPassword");
        final String SM_Username = payload.get("StoreManagerUsername");
        final String SM_Password = payload.get("StoreManagerPassword");
        final String SM_Email = payload.get("StoreManagerEmail");

        User admin = userRepo.findUserByUsername(AdminUsername);
        if (!admin.isThisThePassword(AdminPassword)) {
            return new ResponseEntity<>("Invalid Admin login", HttpStatus.UNAUTHORIZED);
        }

        if (userRepo.findUserByUsername(SM_Username) != null) {
            return new ResponseEntity<>("username is taken", HttpStatus.CONFLICT);
        }

        if (userRepo.findUserByEmail(SM_Email) != null) {
            return new ResponseEntity<>("Email is taken", HttpStatus.CONFLICT);
        }


        User user = new User(SM_Username, SM_Password,SM_Email);
        user.setStoreManager();
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Changes password in Database
     * POST to http://localhost:8080/changePassword
     *
     * @param payload should contain JSON key-value pairs with key(s):"username", "oldPassword", "newPassword".
     * @return CONFLICT if old password is incorrect, else OK
     */
    @RequestMapping(value = "/changePassword", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity changeStoreManagerPassword(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("oldPassword") || !payload.containsKey("newPassword")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String oldPassword = payload.get("oldPassword");
        final String newPassword = payload.get("newPassword");

        User user = userRepo.findUserByUsername(username);
        if (user == null) {
            return new ResponseEntity<>("User not found in database", HttpStatus.NOT_FOUND);
        }
        if (!user.getPassword().equals(String.valueOf(oldPassword.hashCode()))) {
            return new ResponseEntity<>("Old Password is incorrect", HttpStatus.UNAUTHORIZED);
        }
        user.setPassword(newPassword);

        userRepo.save(user);
        return new ResponseEntity<>(user.getUsername() + "'s password Changed", HttpStatus.OK);
    }

    /**
     * find all Store Managers that contains a given string in name
     * POST to http://localhost:8080/searchStoreManagersByName
     *
     * @param payload should contain JSON key-value pairs with key(s): "StoreManagerName".
     * @return A JSON array of the matching Store Managers.
     */
    @RequestMapping(value = "/searchStoreManagersByName", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity searchStoreManagersByName(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("StoreManagerName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String StoreManagerName = payload.get("StoreManagerName");

        List<User> managers = userRepo.findByUsernameIgnoreCaseContaining(StoreManagerName);
        Map<String, String> response = new HashMap<>();

        for (User sm : managers) {
            if(sm.getRole() == UserRoles.STORE_MANAGER) {
                response.put(sm.getUsername(), sm.getEmail());
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}


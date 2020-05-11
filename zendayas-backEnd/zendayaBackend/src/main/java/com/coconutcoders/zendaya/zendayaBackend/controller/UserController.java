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
     * POST to http://localhost:8080/updateUser
     *
     * @param payload should contain JSON key-value pairs with key(s):"username", "newUsername", "newPassword", "newEmail"
     * @return NOT_FOUND if store manager not found, else OK
     */
    @RequestMapping(value = "/updateUser", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity updateUser(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("newUsername")
                || !payload.containsKey("newPassword") || !payload.containsKey("newEmail")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String newUsername = payload.get("newUsername");
        final String newPassword = payload.get("newPassword");
        final String newEmail = payload.get("newEmail");

        User user = userRepo.findUserByUsername(username);
        if (user == null) {
            return new ResponseEntity<>("User not found in database", HttpStatus.NOT_FOUND);
        }
        user.setPassword(newPassword);
        user.setEmail(newEmail);
        user.setUsername(newUsername);

        userRepo.save(user);
        return new ResponseEntity<>(user.getUsername() + "'s details Changed", HttpStatus.OK);
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
        Map<String, HashMap<String,String>> response = new HashMap<>();

        for (User sm : managers) {
            if(sm.getRole() == UserRoles.STORE_MANAGER) {
                HashMap<String,String> temp = new HashMap<>();
                temp.put("username",sm.getUsername());
                temp.put("password",sm.getPassword());
                temp.put("email",sm.getEmail());
                response.put(sm.getUsername(),temp);
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * find all Users that contains a given string in name
     * POST to http://localhost:8080/searchUsersByName
     *
     * @param payload should contain JSON key-value pairs with key(s): "username".
     * @return A JSON array of the matching Users
     */
    @RequestMapping(value = "/searchUsersByName", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity searchUsersByName(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        List<User> users = userRepo.findByUsernameIgnoreCaseContaining(username);
        Map<String, HashMap<String,String>> response = new HashMap<>();

        for (User user : users) {
            if(user.getRole() == UserRoles.USER) {
                HashMap<String,String> temp = new HashMap<>();
                temp.put("username",user.getUsername());
                temp.put("password",user.getPassword());
                temp.put("email",user.getEmail());
                response.put(user.getUsername(),temp);
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get user information
     * POST to http://localhost:8080/getUserInfo
     *
     * @param payload should contain JSON key-value pairs with key(s): "username".
     * @return A JSON array of the matching Store Managers.
     */
    @RequestMapping(value = "/getUserInfo", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity getUserInfo(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        User user = userRepo.findUserByUsername(username);
        if(user == null)
        {
            return new ResponseEntity<>("No such user", HttpStatus.NOT_FOUND);
        }
        Map<String, String> response = new HashMap<>();

        response.put("username", user.getUsername());
        response.put("email",user.getEmail());
        response.put("password",user.getPassword());
        response.put("type", String.valueOf(user.getRole()));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Deleting a User
     * POST to http://localhost:8080/deleteUser
     *
     * @param payload should contain JSON key-value pairs with key(s): "username"
     * @return UNAUTHORIZED if admin details are invalid, else ACCEPTED
     */
    @PostMapping(value = "/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        User user = userRepo.findUserByUsername(username);
        if (user == null) {
            return new ResponseEntity<>("user not found", HttpStatus.NOT_FOUND);
        }
        userRepo.delete(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}


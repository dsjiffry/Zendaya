package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.StoreManager;
import com.coconutcoders.zendaya.zendayaBackend.repo.StoreManagerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class StoreManagerController
{
        @Autowired
        private StoreManagerRepo storeManagerRepo;

    /**
     * Adds Store Manager to Database
     * POST to http://localhost:8080/addStoreManager
     * @param payload should contain JSON key-value pairs with keys: "username", "password".
     * @return CONFLICT if a Store Manager with same name is already in DB, else OK
     */
    @RequestMapping(value = "/addStoreManager", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity addStoreManager(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("username") || !payload.containsKey("password"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String password = payload.get("password");

        StoreManager storeManager = storeManagerRepo.findStoreManagerByUsername(username);
        if(storeManager != null)
        {
            return new ResponseEntity<>("Store Manager already in database", HttpStatus.CONFLICT);
        }
        storeManager = new StoreManager(username,password);

        storeManagerRepo.save(storeManager);
        return new ResponseEntity<>(storeManager.getUsername()+" Added to Database", HttpStatus.OK);
    }


    /**
     * Changes Store Manager password in Database
     * POST to http://localhost:8080/changeStoreManagerPassword
     * @param payload should contain JSON key-value pairs with keys:"username", "oldPassword", "newPassword".
     * @return CONFLICT if old password is incorrect, else OK
     */
    @RequestMapping(value = "/changeStoreManagerPassword", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity changeStoreManagerPassword(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("username") ||!payload.containsKey("oldPassword") || !payload.containsKey("newPassword"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");
        final String oldPassword = payload.get("oldPassword");
        final String newPassword = payload.get("newPassword");

        StoreManager storeManager = storeManagerRepo.findStoreManagerByUsername(username);
        if(storeManager == null)
        {
            return new ResponseEntity<>("Store Manager not found in database", HttpStatus.NOT_FOUND);
        }
        if(!storeManager.getPassword().equals(oldPassword))
        {
            return new ResponseEntity<>("Old Password is incorrect", HttpStatus.UNAUTHORIZED);
        }
        storeManager.setPassword(newPassword);

        storeManagerRepo.save(storeManager);
        return new ResponseEntity<>(storeManager.getUsername()+"'s password Changed", HttpStatus.OK);
    }


    /**
     * Removes Store Manager from Database
     * POST to http://localhost:8080/removeStoreManager
     * @param payload should contain JSON key-value pairs with keys: "username".
     * @return NOT FOUND if the Store Manager is not in DB, else OK
     */
    @RequestMapping(value = "/removeStoreManager", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeStoreManager(@RequestBody Map<String, String> payload)
    {
        if(!payload.containsKey("username"))
        {
            return new ResponseEntity<>("required keys not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String username = payload.get("username");

        StoreManager storeManager = storeManagerRepo.findStoreManagerByUsername(username);
        if(storeManager == null)
        {
            return new ResponseEntity<>("Store Manager Not in database", HttpStatus.NOT_FOUND);
        }

        storeManagerRepo.delete(storeManager);
        return new ResponseEntity<>(storeManager.getUsername()+" removed from Database", HttpStatus.OK);
    }
}

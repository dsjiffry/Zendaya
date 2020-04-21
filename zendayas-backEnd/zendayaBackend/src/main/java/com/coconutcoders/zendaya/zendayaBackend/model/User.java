package com.coconutcoders.zendaya.zendayaBackend.model;

import com.coconutcoders.zendaya.zendayaBackend.enums.UserRoles;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class User {
    @Id
    private ObjectId id;

    private String username;  //Should be unique
    private String password;
    private UserRoles role; //USER, ADMIN or STORE_MANAGER

    private User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = String.valueOf(password.hashCode()); //Avoid storing plaintext passwords
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = String.valueOf(password.hashCode());
    }

    public boolean isThisThePassword(String password) {
        if (this.password.equals(String.valueOf(password.hashCode()))) {
            return true;
        }
        return false;
    }

    public void setAdmin() {
        this.role = UserRoles.ADMIN;
    }

    public void setUser() {
        this.role = UserRoles.USER;
    }

    public void setStoreManager() {
        this.role = UserRoles.STORE_MANAGER;
    }
}

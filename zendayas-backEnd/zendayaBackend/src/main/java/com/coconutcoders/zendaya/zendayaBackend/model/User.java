package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class User
{
    @Id
    private ObjectId id;

    private String username;  //Should be unique
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }



    public User() {
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
        this.password = password;
    }
}

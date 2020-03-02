package com.coconutcoders.zendaya.zendayaBackend.model;


import org.springframework.data.annotation.Id;


public class Greeting {

    @Id
    long id;
    String name;
    String greeting;

    public Greeting(String name, String greeting) {
        this.name = name;
        this.greeting = greeting;
    }

    public Greeting() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }
}

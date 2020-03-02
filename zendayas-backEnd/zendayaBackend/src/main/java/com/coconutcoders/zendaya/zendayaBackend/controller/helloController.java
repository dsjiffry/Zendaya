package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.Greeting;
import com.coconutcoders.zendaya.zendayaBackend.repo.GreetingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
public class helloController {

    @Autowired
    GreetingRepo greetingRepo;


    //Simple GET request Handling
    @GetMapping("/hello")
    public String helloGreeting()
    {
        return "Hello World";
    }

    //If you Request http://localhost:8080/newGreeting
    //A new Mongo Db document is made according to the greeting object and saved to DB
    //Then its retrieved from DB and returned

    //This is to test out The mongoDB connection
    @GetMapping("/newGreeting")
    public String newGreeting()
    {
        Greeting greeting = new Greeting("Aqeel", "Good Morning");
        greetingRepo.save(greeting);

        Greeting fetchedGreeting = greetingRepo.findByName("Aqeel");

        return  "the saved Greeting " + fetchedGreeting.getGreeting() + " ! " + fetchedGreeting.getName();

    }

    //Get Request with Path parameters
    //If you Request http://localhost:8080/greetingsWithGetParams/jello
    //You will return jello as param1
    @GetMapping("/greetingsWithGetPathParams/{param1}")
    public String greetingsWithGetPathParams(@PathVariable String param1)
    {
        //You can get the path variables
        return  param1;
    }


    //Get request with Query parameters
    //If You request for http://localhost:8080//greetingsWithGetQueryParams?name=aqeel&greeting=good morning
    //You get aqeel good morning
    @GetMapping("/greetingsWithGetQueryParams")
    public String greetingsWithQueryParameters(@RequestParam String name , @RequestParam String greeting)
    {
        return name + " " + greeting;
    }



    //Post Request
    //Use the same field names you used in the Greetings class so all the form data from Post Request
    //will be saved in greetingResponse object
    @PostMapping(value = "/greetingWithPost")
    public ResponseEntity< String > greetingSubmit(@RequestParam String name, @RequestParam String greeting ) {

       //Accessing The Sent POST data
        System.out.println(name + " " + greeting);
        //This will return HTTP 200 to say its okay , You may send other HTTP status codes as well
        return  ResponseEntity.status(HttpStatus.OK).build();
    }



}



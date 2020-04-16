package com.coconutcoders.zendaya.zendayaBackend;

import com.google.gson.Gson;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertTrue;



public class ZendayaBackendApplicationTests {

    public final String baseURL = "http://localhost:8080";
    private final String username = "admin";
    private final String password = "admin";
    public String AUTHENTICATION_TOKEN;

    /**
     * Getting the Authentication token.
     */
    @BeforeClass
    public void preRequisites()
    {
        ZendayaBackendApplication.main(new String[] {});
        String url = baseURL + "/authenticate";
        Map<String, String> body = new HashMap<>();
        body.put("userName", username);
        body.put("password", password);

        String token = null;
        try {
            HttpClient httpClient = HttpClientBuilder.create().build();
            StringEntity postingString = new StringEntity(new Gson().toJson(body));
            HttpPost post = new HttpPost(url);
            post.setEntity(postingString);
            post.setHeader("Content-type", "application/json");
            HttpResponse response = httpClient.execute(post);
            token = EntityUtils.toString(response.getEntity(),"UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
        AUTHENTICATION_TOKEN = token.replaceAll("[\"{}]","").replaceFirst("jwt:","");



    }


    @Test
    public void testProductCRUD() {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("price", "999");
        body.put("description", "product for test. Should be deleted at end of test");
        body.put("discount", "4");
        body.put("username", username);

        //Creating a Product
        String url = baseURL + "/addProduct";
        HttpResponse response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Adding a Review
        url = baseURL + "/addReview";
        body.put("username", username);
        body.put("description", "I love this test product");
        body.put("rating", "4.2");
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Updating a Product
        url = baseURL + "/updateProduct";
        body.put("discount", "10");
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);


    }

    @Test
    public void testShoppingCartCRUD() {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("username", username);
        body.put("quantity", "2");

        //Adding to Shopping cart
        String url = baseURL + "/addToShoppingCart";
        HttpResponse response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from Shopping cart
        url = baseURL + "/removeFromShoppingCart";
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @Test
    public void testWishListCRUD() {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("username", username);

        //Adding to wish list
        String url = baseURL + "/addToWishList";
        HttpResponse response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Moving to Shopping cart
        url = baseURL + "/moveToShoppingCart";
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from Shopping cart
        url = baseURL + "/removeFromShoppingCart";
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from wish list
        url = baseURL + "/removeFromWishList";
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @Test
    public void testStoreManagerCRUD() {
        Map<String, String> body = new HashMap<>();
        body.put("username", username);
        body.put("password", password);

        //Adding a Store Manager
        String url = baseURL + "/addStoreManager";
        HttpResponse response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Change Store Manager Password
        body.put("oldPassword", password);
        body.put("newPassword", password+"12");
        url = baseURL + "/changeStoreManagerPassword";
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing Store Manager
        url = baseURL + "/removeStoreManager";
        response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

    }













    @AfterSuite
    public void DeleteAll()
    {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("price", "999");
        body.put("description", "product for test. Should be deleted at end of test");
        body.put("discount", "4");
        body.put("username", username);

        //Deleting a Product
        String url = baseURL + "/removeProduct";
        HttpResponse response = createRequest(body, url, "POST");

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

    }



    /**
     * used by tests to make requests
     * @param body JSON body of the request
     * @param url the url to which the request is made
     * @param RequestType "POST", "PUT" or "DELETE"
     * @return HttpResponse
     */
    public HttpResponse createRequest(Map<String, String> body, String url,String RequestType) {
        HttpResponse response = null;
        try {
            HttpClient httpClient = HttpClientBuilder.create().build();
            StringEntity postingString = new StringEntity(new Gson().toJson(body));
            switch (RequestType) {
                case "POST":
                    HttpPost post = new HttpPost(url);
                    post.setEntity(postingString);
                    post.setHeader("Content-type", "application/json");
                    post.setHeader("Authorization", "Bearer "+AUTHENTICATION_TOKEN);
                    response = httpClient.execute(post);
                    break;

                case "PUT":
                    HttpPut put = new HttpPut(url);
                    put.setEntity(postingString);
                    put.setHeader("Content-type", "application/json");
                    put.setHeader("Authorization", "Bearer "+AUTHENTICATION_TOKEN);
                    response = httpClient.execute(put);
                    break;

                case "DELETE":
                    HttpDelete delete = new HttpDelete(url);
                    delete.setHeader("Content-type", "application/json");
                    delete.setHeader("Authorization", "Bearer "+AUTHENTICATION_TOKEN);
                    response = httpClient.execute(delete);
                    break;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

}

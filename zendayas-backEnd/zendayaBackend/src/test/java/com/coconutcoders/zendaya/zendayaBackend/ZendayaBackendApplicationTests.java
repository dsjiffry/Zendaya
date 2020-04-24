package com.coconutcoders.zendaya.zendayaBackend;

import com.google.gson.Gson;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
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
    private final String username = "testAdmin";
    private final String password = "testAdmin";
    public String AUTHENTICATION_TOKEN;

    /**
     * Making a new admin and Getting the Authentication token.
     */
    @BeforeClass
    public void preRequisites() {
        ZendayaBackendApplication.main(new String[]{});
        String url = baseURL + "/authenticate";
        Map<String, String> body = new HashMap<>();
        body.put("userName", username);
        body.put("username", username);
        body.put("password", password);

        createRequest(body, baseURL + "/createAdmin", false); //Creating the admin account to obtain jwt

        String token = null;
        try {
            HttpResponse response = createRequest(body, url, false);
            token = EntityUtils.toString(response.getEntity(), "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
        AUTHENTICATION_TOKEN = token.replaceAll("[\"{}]", "").replaceFirst("jwt:", "");
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
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Adding a Review
        url = baseURL + "/addReview";
        body.put("username", username);
        body.put("description", "I love this test product");
        body.put("rating", "4.2");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Updating a Product
        url = baseURL + "/updateProduct";
        body.put("discount", "10");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);


    }

    @Test(dependsOnMethods = {"testProductCRUD"})
    public void testWishListCRUD() {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("username", username);

        //Adding to wish list
        String url = baseURL + "/addToWishList";
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Moving to Shopping cart
        url = baseURL + "/moveToShoppingCart";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from Shopping cart
        url = baseURL + "/removeFromShoppingCart";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from wish list
        url = baseURL + "/removeFromWishList";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @Test(dependsOnMethods = {"testWishListCRUD"})
    public void testShoppingCartCRUD() {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("username", username);
        body.put("quantity", "2");

        //Adding to Shopping cart
        String url = baseURL + "/addToShoppingCart";
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // Getting the combined details of the items
        url = baseURL + "/getTotalPriceAndNumberOfItems";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // Getting the individual details of the items
        url = baseURL + "/getProductsAndDetails";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from Shopping cart
        url = baseURL + "/removeFromShoppingCart";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //purchase items in Shopping cart
        url = baseURL + "/purchaseItemsInCart";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @Test(dependsOnMethods = {"testShoppingCartCRUD"})
    public void testPayment() {
        Map<String, String> body = new HashMap<>();
        body.put("username", username);
        body.put("status", "delivered");

        // Getting Payment History
        String url = baseURL + "/getPaymentHistory";
        HttpResponse response = createRequest(body, url, true);
        try {
            String dateTime = EntityUtils.toString(response.getEntity(), "UTF-8");
            dateTime = dateTime.split(",")[0].split("\"")[1];
            body.put("dateTime", dateTime);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // Getting the details of particular purchase
        url = baseURL + "/getPaymentDetails";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // set the order status
        url = baseURL + "/setOrderStatus";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // get the order status
        url = baseURL + "/getOrderStatus";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

    }

    @AfterSuite
    public void DeleteAll() {
        Map<String, String> body = new HashMap<>();
        body.put("productName", "testProduct");
        body.put("price", "999");
        body.put("description", "product for test. Should be deleted at end of test");
        body.put("discount", "4");
        body.put("username", username);

        //Deleting a Product
        String url = baseURL + "/removeProduct";
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

    }


    /**
     * used by tests to make requests
     *
     * @param body              JSON body of the request
     * @param url               the url to which the request is made
     * @param useAuthentication if true Authentication header will also be added
     * @return HttpResponse
     */
    public HttpResponse createRequest(Map<String, String> body, String url, boolean useAuthentication) {
        HttpResponse response = null;
        try {
            HttpClient httpClient = HttpClientBuilder.create().build();
            StringEntity postingString = new StringEntity(new Gson().toJson(body));
            HttpPost post = new HttpPost(url);
            post.setEntity(postingString);
            post.setHeader("Content-type", "application/json");
            if (useAuthentication) {
                post.setHeader("Authorization", "Bearer " + AUTHENTICATION_TOKEN);
            }
            response = httpClient.execute(post);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

}

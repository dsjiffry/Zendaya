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
    private final String email = "testAdmin@gmail.com";
    public String AUTHENTICATION_TOKEN;

    /**
     * Making a new admin and Getting the Authentication token.
     */
    @BeforeClass
    public void preRequisites() {
        ZendayaBackendApplication.main(new String[]{});
        String url = baseURL + "/authenticate";
        Map<String, String> body = new HashMap<>(); // The JSON Body
        body.put("userName", username);
        body.put("username", username);
        body.put("password", password);
        body.put("email", email);

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
        Map<String, String> body = new HashMap<>(); // The JSON Body

        //Creating a Product
        String url = baseURL + "/addProduct";
        body.put("productName", "testProduct");
        body.put("price", "999");
        body.put("description", "product for test. Should be deleted at end of test");
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Adding a Review
        url = baseURL + "/addReview";
        body.put("productName", "testProduct");
        body.put("username", username);
        body.put("description", "I love this test product");
        body.put("rating", "4.2");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Updating a Product
        url = baseURL + "/updateProduct";
        body.put("productName", "testProduct");
        body.put("price", "899");
        body.put("description", "product for test. Should be deleted at end of test");
        body.put("discount", "10");
        body.put("newProductName", "testProduct");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Updating a Product's discount
        url = baseURL + "/setProductDiscount";
        body.put("discount", "12");
        body.put("productName", "testProduct");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Searching for products
        url = baseURL + "/searchProductsByName";
        body.put("productName", "");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Searching for products that have a discount
        url = baseURL + "/searchProductWithDiscount";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Get a products Pricing details
        url = baseURL + "/getProductPricingDetails";
        body.put("productName", "testProduct");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);


    }

    @Test(dependsOnMethods = {"testProductCRUD"})
    public void testWishListCRUD() {
        Map<String, String> body = new HashMap<>(); // The JSON Body

        //Adding to wish list
        String url = baseURL + "/addToWishList";
        body.put("productName", "testProduct");
        body.put("username", username);
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //Moving to Shopping cart
        url = baseURL + "/moveToShoppingCart";
        body.put("productName", "testProduct");
        body.put("username", username);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from Shopping cart
        url = baseURL + "/removeFromShoppingCart";
        body.put("productName", "testProduct");
        body.put("username", username);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from wish list
        url = baseURL + "/removeFromWishList";
        body.put("productName", "testProduct");
        body.put("username", username);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @Test(dependsOnMethods = {"testWishListCRUD"})
    public void testShoppingCartCRUD() {
        Map<String, String> body = new HashMap<>(); // The JSON Body

        //Adding to Shopping cart
        String url = baseURL + "/addToShoppingCart";
        body.put("username", username);
        body.put("productName", "testProduct");
        body.put("quantity", "2");
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // Getting the combined details of the items
        url = baseURL + "/getTotalPriceAndNumberOfItems";
        body.put("username", username);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // Getting the individual details of the items
        url = baseURL + "/getProductsAndDetails";
        body.put("username", username);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //removing from Shopping cart
        url = baseURL + "/removeFromShoppingCart";
        body.put("username", username);
        body.put("productName", "testProduct");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        //purchase items in Shopping cart
        url = baseURL + "/purchaseItemsInCart";
        body.put("username", username);
        body.put("paymentMode","cash");
        body.put("address","No 15 ");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @Test(dependsOnMethods = {"testShoppingCartCRUD"})
    public void testPayment() {
        Map<String, String> body = new HashMap<>(); // The JSON Body
        String dateTime = "";

        // Getting Payment History
        String url = baseURL + "/getPaymentHistory";
        body.put("username", username);
        HttpResponse response = createRequest(body, url, true);
        try {
            dateTime = EntityUtils.toString(response.getEntity(), "UTF-8");
            dateTime = dateTime.split(",")[0].split("\"")[1];
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // Getting the details of particular purchase
        url = baseURL + "/getPaymentDetails";
        body.put("username", username);
        body.put("dateTime", dateTime);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // set the order status
        url = baseURL + "/setOrderStatus";
        body.put("username", username);
        body.put("dateTime", dateTime);
        body.put("status", "delivered");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // get the order status
        url = baseURL + "/getOrderStatus";
        body.put("username", username);
        body.put("dateTime", dateTime);
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

    }

    @Test(dependsOnMethods = {"testProductCRUD"})
    public void testProductCategories() {
        Map<String, String> body = new HashMap<>(); // The JSON Body

        // Creating a Category
        String url = baseURL + "/createCategory";
        body.put("categoryName", "testCategory");
        HttpResponse response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // add Product to Category
        url = baseURL + "/addToCategory";
        body.put("categoryName", "testCategory");
        body.put("productName", "testProduct");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // remove Product from Category
        url = baseURL + "/removeFromCategory";
        body.put("categoryName", "testCategory");
        body.put("productName", "testProduct");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // get all categories
        url = baseURL + "/getAllCategories";
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);

        // deleting the category
        url = baseURL + "/deleteCategory";
        body.put("categoryName", "testCategory");
        response = createRequest(body, url, true);

        assertNotNull(response);
        assertTrue(response.getStatusLine().getStatusCode() <= 399);
    }

    @AfterSuite
    public void DeleteAll() {
        Map<String, String> body = new HashMap<>(); // The JSON Body
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

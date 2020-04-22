package com.coconutcoders.zendaya.zendayaBackend.controller;

import com.coconutcoders.zendaya.zendayaBackend.model.Image;
import com.coconutcoders.zendaya.zendayaBackend.repo.ImageRepo;
import com.coconutcoders.zendaya.zendayaBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
public class ImageController {
    @Autowired
    private ImageRepo imageRepo;

    @Autowired
    private ProductRepo productRepo;

    /**
     * obtain adds an image to a Product
     * POST to http://localhost:8080/addImage
     *
     * @param productName
     * @param file a multipart file with the image
     * @return NOT_FOUND if no such Product in DB, else OK
     */
    @RequestMapping(value = "/addImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity addImage(@RequestParam String productName, @RequestParam MultipartFile file) {

        if(productRepo.findByNameIgnoreCase(productName) == null)
        {
            return new ResponseEntity<>("No such product in DB", HttpStatus.NOT_FOUND);
        }

        Image image = imageRepo.findByProductName(productName);
        if (image == null) {
            image = new Image(productName);
        }

        try {
            image.addImage(file.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        imageRepo.save(image);

        return new ResponseEntity<>("Image added", HttpStatus.OK);
    }

    /**
     * obtain all images for Product
     * POST to http://localhost:8080/getImages
     *
     * @param payload should contain JSON key-value pairs with key(s): "productName".
     * @return NOT_FOUND if no such Product in DB, else OK
     */
    @RequestMapping(value = "/getImages", method = RequestMethod.POST, consumes = "application/json", produces = "multipart/form-data")
    public ResponseEntity getImages(@RequestBody Map<String, String> payload) {

        if (!payload.containsKey("productName")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");

        Image images = imageRepo.findByProductName(productName);
        if (images == null) {
            return new ResponseEntity<>("Product Not Found in database", HttpStatus.NOT_FOUND);
        }

        LinkedMultiValueMap<String, Object> response = new LinkedMultiValueMap<>();
        for (Map.Entry<String, byte[]> eachImage : images.getAllImages().entrySet()) {
            Path tempFile = null;
            try {
                tempFile = Files.createTempFile(null, ".jpeg");
                Files.write(tempFile, eachImage.getValue());
            } catch (IOException e) {
                e.printStackTrace();
            }
            File fileToSend = tempFile.toFile();
            response.add(eachImage.getKey(), new FileSystemResource(fileToSend));
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Remove an image from a product
     * POST to http://localhost:8080/removeImage
     *
     * @param payload should contain JSON key-value pairs with key(s): "productName" and "imageNumber".
     * @return NOT_FOUND if no such Product in DB, else OK
     */
    @RequestMapping(value = "/removeImage", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity removeImage(@RequestBody Map<String, String> payload) {

        if (!payload.containsKey("productName") || !payload.containsKey("imageNumber")) {
            return new ResponseEntity<>("required key(s) not found in JSON Body", HttpStatus.NOT_FOUND);
        }
        final String productName = payload.get("productName");
        final String imageNumber = payload.get("imageNumber");

        Image image = imageRepo.findByProductName(productName);
        if (image == null) {
            return new ResponseEntity<>("Product Not Found in database", HttpStatus.NOT_FOUND);
        }
        image.removeImage(imageNumber);
        imageRepo.save(image);

        return new ResponseEntity<>("Image removed", HttpStatus.OK);
    }
}

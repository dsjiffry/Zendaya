package com.coconutcoders.zendaya.zendayaBackend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

public class Image implements MultipartFile {

    @Id
    private ObjectId id;

    private String productName;
    private HashMap<String, byte[]> allImages;
    private byte[] thumbnail;
    private int numberOfImages = 0;

    public Image(String productName) {
        this.productName = productName;
        this.allImages = new HashMap<>();
    }

    public String getProductName() {
        return productName;
    }

    public void addImage(byte[] image) {
        numberOfImages++;
        allImages.put(productName + "_" + numberOfImages, image);
    }

    public byte[] getImage(int imageNumber) {
        return allImages.get(productName + "_" + imageNumber);
    }

    public void updateImage(int imageNumber, byte[] image) {
        allImages.put(productName + "_" + imageNumber, image);
    }

    public void setThumbnail(byte[] image) {
        this.thumbnail = image;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void removeImage(String imageNumber) {
        numberOfImages--;
        allImages.remove(productName + "_" + imageNumber);
    }

    public HashMap<String, byte[]> getAllImages() {
        return allImages;
    }

    @Override
    public String getName() {
        // TODO - implementation depends on your requirements
        return null;
    }

    @Override
    public String getOriginalFilename() {
        // TODO - implementation depends on your requirements
        return null;
    }

    @Override
    public String getContentType() {
        // TODO - implementation depends on your requirements
        return null;
    }

    @Override
    public boolean isEmpty() {
        return false;
    }

    @Override
    public long getSize() {
        return 0;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return new byte[]{};
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(new byte[]{});
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
    }
}